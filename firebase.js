import firebase from 'firebase'
require('firebase/firestore')

const config = {
  apiKey: "AIzaSyAihYdLAeDX7ZqW72avjItnmcuFQdntZN0",
  authDomain: "peril-game.firebaseapp.com",
  databaseURL: "https://peril-game.firebaseio.com",
  projectId: "peril-game",
  storageBucket: "peril-game.appspot.com",
  messagingSenderId: "7645117184"
}
firebase.initializeApp(config)

export default firebase
