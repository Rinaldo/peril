const game = require('./stackpardy.json')

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

db.collection('GameTemplate').add(game)
.then(() => console.log('seeded successfully\npress ^C to exit'))
.catch(() => console.log('error seeding database\npress ^C to exit'))
// .finally(() => console.log('press ^C to exit'))
