import React from 'react'
import { render } from 'react-dom'
import { Provider } from './fire-connect'
import { auth, db, rt, firebaseTimestamp, firestoreTimestamp } from './firebase'

import Main from './components/Main'

render(
  <Provider auth={auth} firebase={rt} firestore={db} firebaseTimestamp={firebaseTimestamp} firestoreTimestamp={firestoreTimestamp} onIdTokenChanged>
    <Main />
  </Provider>,
  document.getElementById('app')
)
