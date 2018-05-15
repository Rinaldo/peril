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

// db.collection('GameTemplate').add(game)
// .then(() => console.log('seeded successfully\npress ^C to exit'))
// .catch(() => console.log('error seeding database\npress ^C to exit'))

const formatGame = game => {
  const formatted = {...game}
  delete formatted.categories
  formatted.rows = Array(game.height).fill(null).map(_ => Array(game.width).fill(null))
  formatted.headers = Array(game.width).fill(null)
  for (let i = 0; i < game.width; i++) {
    if (game.categories[i]) {
      formatted.headers[i] = game.categories[i].name
    }
    for (let j = 0; j < game.height; j++) {
      if (game.categories[i] && game.categories[i].questions[j]) {
        formatted.rows[j][i] = game.categories[i].questions[j]
      }
    }
  }
  return formatted
}

const addQuestions = (user) => {
  const rows = formatGame(gameToSeed).rows
  const promises = []
  for (let row of rows) {
    for (let question of row) {
      const questionObj = {
        isPublic: true,
        prompt: question.prompt,
        response: question.response,
        author: {
          name: user.displayName,
          uid: user.uid,
        }
      }
      if (question.double) questionObj.double = true
      promises.push(db.collection('questions').add(questionObj))
    }
  }
  return Promise.all(promises)
}

firebase.auth().signInWithEmailAndPassword('', '')
.then(user => {
  return addQuestions(user)
  .catch(err => console.log('Error adding questions', err))
  .then(() => console.log('Done'))
})
.catch(err => console.log('Error signing in', err))
