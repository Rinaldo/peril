import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'fire-connect'
import { auth, firestore, database, firebaseTimestamp } from './firebase'

import Main from './components/Main'

render(
  <Provider
    auth={auth}
    database={database}
    firestore={firestore}
    firebaseTimestamp={firebaseTimestamp}
    // firestoreFieldValue={firestoreFieldValue}
    onIdTokenChanged>
    <Main />
  </Provider>,
  document.getElementById('app')
)
