import firebase from 'firebase'
import 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyAihYdLAeDX7ZqW72avjItnmcuFQdntZN0',
  authDomain: 'peril-game.firebaseapp.com',
  databaseURL: 'https://peril-game.firebaseio.com',
  projectId: 'peril-game',
  storageBucket: 'peril-game.appspot.com',
  messagingSenderId: '7645117184'
}
firebase.initializeApp(config)

export const db = firebase.firestore()
export const rt = firebase.database()
export const auth = firebase.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider()

export const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP
export const firestoreTimestamp = firebase.firestore.FieldValue.serverTimestamp

export default firebase
