import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Menu } from 'semantic-ui-react'
import { authConnect, googleProvider } from '../firebase'
import { loginFields, signupFields } from '../utils'

import AuthDropdown from './AuthDropdown'


const Navbar = ({ user, logOut, emailSignup, emailLogin, ...propsToPass }) => (
  <Menu attached inverted>
    <Menu.Item as={Link} to="/home">
      Peril
    </Menu.Item>
    <Menu.Menu position="right">
      {!user ?
      <React.Fragment>
        <Menu.Item>
          <AuthDropdown method="Sign up" submit={emailSignup} formFields={signupFields} {...propsToPass} />
        </Menu.Item>
        <Menu.Item>
          <AuthDropdown method="Log in" submit={emailLogin} formFields={loginFields} {...propsToPass} />
        </Menu.Item>
      </React.Fragment>
      :
      <React.Fragment>
        <Menu.Item>
          <Button>{user.displayName}</Button>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={logOut}>Log Out</Button>
        </Menu.Item>
      </React.Fragment>
      }
    </Menu.Menu>
  </Menu>
)

const addDispatchers = (component, db, auth) => ({
  logOut() {
    auth.signOut()
  },
  // returns an object containing the user object along with other info including additionalUserInfo.isNewUser
  googleLogin() {
    auth.signInWithPopup(googleProvider)
    .catch(err => console.error('Sign up or sign in error:', err))
  },
  // returns the user object
  emailLogin(email, password) {
    auth.signInWithEmailAndPassword(email, password)
    .catch(err => console.error('Sign up or sign in error:', err))
  },
  // returns the user object
  emailSignup(email, password, name) {
    auth.createUserWithEmailAndPassword(email, password)
    .then(user => Promise.all([user, user.updateProfile({ displayName: name })]))
    .then(([user]) => user.getIdToken(true))
    .catch(err => console.error('Sign up or sign in error:', err))
  }
})

export default authConnect(null, addDispatchers)(Navbar)
