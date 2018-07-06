const gameToSeed = require('./stackpardy.json')

const firebase = require('firebase')
require('firebase/firestore')

const { username, password } = require('./secrets')

//copied from utils
const formatGame = game => {
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

const createQuestionAutoTags = (prompt, response) => {
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


const config = {
  apiKey: 'AIzaSyAihYdLAeDX7ZqW72avjItnmcuFQdntZN0',
  authDomain: 'peril-game.firebaseapp.com',
  databaseURL: 'https://peril-game.firebaseio.com',
  projectId: 'peril-game',
  storageBucket: 'peril-game.appspot.com',
  messagingSenderId: '7645117184'
}
firebase.initializeApp(config)

const db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

const batchWriteTags = (tagSet, collectionName) => {
  const batch = db.batch()
  const collection = db.collection(collectionName)
  Object.keys(tagSet).forEach(tag => {
    batch.set(collection.doc(tag), { tag })
  })
  return batch.commit()
}

const addQuestions = user => {
  const promises = []
  const rows = formatGame(gameToSeed).rows
  for (let row of rows) {
    for (let question of row) {
      const { prompt, response } = question
      const autoTags = createQuestionAutoTags(prompt, response)
      const questionObj = {
        prompt,
        response,
        isPublic: true,
        author: {
          name: user.displayName,
          uid: user.uid,
        },
        allTags: autoTags,
        gameCount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }
      if (question.double) questionObj.double = true
      promises.push(
        db.collection('questions').add(questionObj)
        .then(() => batchWriteTags(autoTags, 'tagsInQuestions'))
      )
    }
  }
  return Promise.all(promises)
}


console.log('signing in...')
firebase.auth().signInWithEmailAndPassword(username, password)
.then(userCredential => {
  console.log('signed in')
  console.log('seeding questions')
  return addQuestions(userCredential.user)
  .then(resolvedPromises => {
    console.log(`seeded ${resolvedPromises.length} questions`)
    console.log('Done')
    return 0
  })
  .catch(err => {
    console.error('Error adding questions', err)
    return 1
  })
})
.catch(err => {
  console.log('Error signing in', err)
  return 1
})
.then(code => {
  process.exit(code)
})
