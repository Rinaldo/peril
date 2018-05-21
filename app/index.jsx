import React from 'react'
import { render } from 'react-dom'
import { Provider } from './fire-connect'
import { auth, db, rt } from './firebase'

import Main from './components/Main'

render(
  <Provider auth={auth} firebase={rt} firestore={db} onIdTokenChanged>
    <Main />
  </Provider>,
  document.getElementById('app')
)
