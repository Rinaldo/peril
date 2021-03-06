import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
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

export const firestore = firebase.firestore()
firestore.settings({ timestampsInSnapshots: true })
export const database = firebase.database()
export const auth = firebase.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider()

export const firebaseTimestamp = firebase.database.ServerValue.TIMESTAMP
export const firestoreFieldValue = firebase.firestore.FieldValue

export default firebase
