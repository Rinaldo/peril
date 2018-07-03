const gameToSeed = require('./stackpardy.json')

const firebase = require('firebase')
require('firebase/firestore')

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

// copied from utils
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

const createValidWordSet = (string, wordSet = {}) => {
  const newWordSet = { ...wordSet }
  const spacesAndPunctuation = /((^('|"|\(|`| )+)|(,|\.|;|:|\?|!|'|"|\)|`| )+$)/g
  string.split(' ').map(word => word.toLowerCase().replace(spacesAndPunctuation, '')).forEach(word => {
    if (word.length && word.search(/[^a-zA-Z0-9'-]/) === -1) newWordSet[word] = true
  })
  return newWordSet
}

const stringsToWordSet = (...strings) => strings.reduce((prev, curr) => createValidWordSet(curr, prev), {})


const addQuestions = (user) => {
  const rows = formatGame(gameToSeed).rows
  const promises = []
  for (let row of rows) {
    for (let question of row) {
      const wordSet = stringsToWordSet(question.prompt, question.response)
      const questionObj = {
        isPublic: true,
        prompt: question.prompt,
        response: question.response,
        author: {
          name: user.displayName,
          uid: user.uid,
        },
        autoTags: wordSet,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }
      if (question.double) questionObj.double = true
      promises.push(
        db.collection('questions').add(questionObj)
        .then(() =>
          db.runTransaction(transaction => {
            const refs = Object.keys(wordSet).map(word => db.collection('wordsInQuestions').doc(word))
            return Promise.all(refs.map(async ref => {
              const doc = await transaction.get(ref)
              if (!doc.exists) {
                transaction.set(ref, { count: 1 })
              } else {
                const newCount = doc.data().count + 1
                transaction.update(ref, { count: newCount })
              }
            }))
          })
        )
      )
    }
  }
  return Promise.all(promises)
}

firebase.auth().signInWithEmailAndPassword('', '')
.then(userCredential => {
  return addQuestions(userCredential.user)
  .catch(err => console.log('Error adding questions', err))
  .then(() => console.log('Done'))
})
.catch(err => console.log('Error signing in', err))
