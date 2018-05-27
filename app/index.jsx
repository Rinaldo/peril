import React from 'react'
import { render } from 'react-dom'
import { Provider } from './fire-connect'
import { auth, db, rt, firebaseTimestamp, firestoreFieldValue } from './firebase'

import Main from './components/Main'

render(
  <Provider auth={auth} firebase={rt} firestore={db} firebaseTimestamp={firebaseTimestamp} firestoreFieldValue={firestoreFieldValue} onIdTokenChanged>
    <Main />
  </Provider>,
  document.getElementById('app')
)
