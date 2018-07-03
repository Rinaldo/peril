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
      if (game.categories && game.categories[i] && game.categories[i].questions[j]) {
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

export const createValidWordSet = (string, wordSet = {}) => {
  const newWordSet = { ...wordSet }
  const spacesAndPunctuation = /((^('|"|\(|`| )+)|(,|\.|;|:|\?|!|'|"|\)|`| )+$)/g
  string.split(' ').map(word => word.toLowerCase().replace(spacesAndPunctuation, '')).forEach(word => {
    if (word.length && word.search(/[^a-zA-Z0-9'-]/) === -1) newWordSet[word] = true
  })
  return newWordSet
}

export const stringsToWordSet = (...strings) => strings.reduce((prev, curr) => createValidWordSet(curr, prev), {})


// // may add stopwords later if common words cause problems with transactions
// const stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "just", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "s", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "t", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "will", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"]

// const myStopWords = ["a", "am", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he", "how", "i", "in", "is", "it", "its", "of", "on", "or", "that", "the", "this", "to", "was", "what", "were", "when", "where", "who", "with"]

// const googleStopWords = ["a", "about", "an", "are", "as", "at", "be", "by", "com", "for", "from", "how", "i", "in", "is", "it", "of", "on", "or", "that", "the", "this", "to", "was", "what", "when", "where", "who", "will", "with", "the", "www"]

// const reutersStopWords = ["a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he", "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were", "will", "with"]
