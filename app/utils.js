import { cloneDeepWith } from 'lodash'

export const ItemTypes = {
  QUESTION_FROM_LIST: 'questionFromList',
  QUESTION_FROM_BOARD: 'questionFromBoard'
}

export const formatGame = game => {
  const formatted = {...game}
  delete formatted.categories
  formatted.rows = Array(game.height).fill(null).map(_ => Array(game.width).fill(null))
  formatted.headers = Array(game.width).fill(null)
  for (let i = 0; i < game.width; i++) {
    if (game.categories && game.categories[i]) {
      formatted.headers[i] = game.categories[i].name
    }
    for (let j = 0; j < game.height; j++) {
      if (game.categories && game.categories[i] && game.categories[i].questions && game.categories[i].questions[j]) {
        formatted.rows[j][i] = game.categories[i].questions[j]
      } else {
        formatted.rows[j][i] = { empty: true }
      }
      formatted.rows[j][i].points = (j + 1) * formatted.multiplier
    }
  }
  return formatted
}

export const stripData = game => {
  const stripped = { ...game }
  stripped.categories = {}
  Object.entries(game.categories).forEach(([categoryKey, category]) => {
    stripped.categories[categoryKey] = { name: category.name || `Category ${+categoryKey + 1}`, questions: {} }
    Object.entries(category.questions).forEach(([questionKey, question]) => {
      if (question) stripped.categories[categoryKey].questions[questionKey] = { asked: false }
    })
  })
  return stripped
}

export const stripTags = game => cloneDeepWith(game, (val, key) => {
    if (key === 'allTags' || key === 'userTags') return null
  })

export const listPlayers = players =>
  Object.entries(players).map(([uid, info]) => ({ uid, ...info }))

export const listPlayersByScore = players =>
  listPlayers(players).sort((a, b) => b.score - a.score)

export const playerResponsesByTime = (players, responses) =>
  Object.entries(responses).map(([uid, time]) => ({ uid, time, ...players[uid] })).sort((a, b) => a.time - b.time)


export const equivalent = (left, right) => {
  if (left === right) return true
  if (!left || !right) return false
  if (left.length !== right.length) return false

  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) return false
  }
  return true
}

export const loginFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'email@example.com',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
  }
]

export const signupFields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'John Doe',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'email@example.com',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
  }
]

const myStopWords = new Set(["a", "about", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "has", "he", "how", "in", "is", "it", "its", "of", "on", "or", "she", "that", "the", "they", "this", "to", "was", "were", "what", "when", "who", "with", "you"])

const removeInterrogatives = phrase => phrase.replace(/^(\s*(who|what|when|where|why|how)\s+(is|are)\s+)|\?+\s*$/gi, '')

const preprocessWord = word => {
  const spacesPunctuationAndPossessivesAtEnds = /^['"(`\s]+|[,.;:?!'")`\s]+$|'s[,.;:?!'")`\s]*$/g
  return word.toLowerCase().replace(spacesPunctuationAndPossessivesAtEnds, '')
}

const containsInvalidCharacters = (string, returnIndex) => {
  // disallow __stuff__ and / per firestore, disallow ~ * [ per query, disallow other weirdness per me
  const stuffIDontWant = /(__.*__)|([^a-zA-Z\u00C0-\u017F0-9 @#$%^&<>`'",;:?!_-])|(^[@#$%^&<>`'",;:?!_-]+$)/
  return returnIndex ? string.search(stuffIDontWant) : string.search(stuffIDontWant) !== -1
}

export const mergeTagSets = (...tagSet) => {
  const merged = {}
  tagSet.forEach(set => {
    Object.keys(set).forEach(word => {
      merged[word] = true
    })
  })
  return merged
}

const wordsToTags = (words, wordMap = {}, minLength = 1, stopWordsSet = new Set()) =>
  words.reduce((map, currentWord) => {
    const trimmedWord = preprocessWord(currentWord)
    if (trimmedWord.length >= minLength && !containsInvalidCharacters(trimmedWord) && !stopWordsSet.has(trimmedWord)) {
      map[trimmedWord] = true
    }
    return map
  }, wordMap)

const addPhraseToTags = (phrase, tags) => {
  // add entire phrase if valid or the beginning of the phrase if the phrase contains invalid characters
  phrase = phrase.toLowerCase()
  // slice off ending period (which is invalid)
  if (phrase[phrase.length - 1] === '.') {
    phrase = phrase.slice(0, -1)
  }
  // don't add empty string as tag
  if (!phrase) return tags
  const invalidIndex = containsInvalidCharacters(phrase, 'index')
  // if entirely valid
  if (invalidIndex === -1) {
    tags[phrase] = true
    return tags
  }
  // will make phrase valid
  phrase = phrase.slice(0, invalidIndex).trim()
  // don't add empty string as tag
  if (!phrase) return tags
  // add ellipses to show that there is more to the phrase
  if (phrase.includes(' ')) phrase = phrase + '…'
  tags[phrase] = true

  return tags
}

export const createQuestionAutoTags = (prompt, response) => {
  const tags = {}
  // add individual words to tags
  wordsToTags(prompt.split(' '), tags, 2, myStopWords)
  wordsToTags(response.split(' '), tags, 2, myStopWords)

  // add response with 'what is' and '?' removed if valid and quotes and stuff removed if it's a single word
  // also add response with beginning 'the' removed
  let answer = removeInterrogatives(response.toLowerCase())
  if (!answer.includes(' ')) answer = preprocessWord(answer)
  if (answer && !containsInvalidCharacters(answer)) tags[answer] = true
  const answerWithoutThe = answer.startsWith('the ') ? answer.slice(4) : answer
  if (answer) tags[answerWithoutThe] = true

  addPhraseToTags(prompt, tags)

  return tags
}

export const createGameAutoTags = (title, description) => {
  const tags = {}
  // add individual words to tags
  wordsToTags(title.split(' '), tags, 2, myStopWords)
  wordsToTags(description.split(' '), tags, 2, myStopWords)

  title = title.toLowerCase()
  if (title && !containsInvalidCharacters(title)) tags[title] = true

  addPhraseToTags(description, tags)

  return tags
}

export const parseUserTags = tagString => wordsToTags(tagString.split(','))

const nextLetter = letter => String.fromCodePoint(letter.codePointAt(0) + 1)

export const prefixLimiter = prefix => {
  const firstLetter = prefix[0]
  const lastLetter = prefix[prefix.length - 1]
  const everythingButLastLetter = prefix.slice(0, -1)
  if (lastLetter === 'z' || lastLetter === ' ') {
    return firstLetter === 'z' ? 'z' : nextLetter(firstLetter)
  } else {
    return everythingButLastLetter + nextLetter(lastLetter)
  }
}
// https://stackoverflow.com/questions/15369566/putting-space-in-camel-case-string-using-regular-expression
export const camelCaseToTitleCase = string =>
  (string[0].toUpperCase() + string.slice(1)).replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5')
