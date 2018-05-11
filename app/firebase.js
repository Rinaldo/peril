import firebase from 'firebase'
import 'firebase/firestore'

// import withAuth from './spark/auth'
import connect from './fireConnect'

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
const auth = firebase.auth();

export const provider = new firebase.auth.GoogleAuthProvider();
export const fireAuthConnect = connect(db, auth)
export const fireConnect = connect(db)

export default firebase
