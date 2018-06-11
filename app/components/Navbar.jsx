import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { firestoreConnect, firebaseConnect } from '../fire-connect'
import { googleProvider } from '../firebase'
import { loginFields, signupFields } from '../utils'

import AuthDropdown from './AuthDropdown'


const HostNavbar = ({ user, logOut, emailSignup, emailLogin, ...propsToPass }) => (
  <Menu attached inverted>
    <Menu.Item as={Link} to="/home">
      Peril
    </Menu.Item>
    <Menu.Menu position="right">
      {!user ?
      <>
        <Menu.Item style={{ padding: 0 }}>
          <AuthDropdown method="Sign up" submit={emailSignup} formFields={signupFields} {...propsToPass} />
        </Menu.Item>
        <Menu.Item style={{ padding: 0 }}>
          <AuthDropdown method="Log in" submit={emailLogin} formFields={loginFields} {...propsToPass} />
        </Menu.Item>
      </>
      :
      <>
        <Menu.Item style={{ padding: 0 }}>
          <div style={{ padding: '.93em 1.14em' }}>{user.displayName}</div>
        </Menu.Item>
        <Menu.Item style={{ padding: 0 }}>
          <div style={{ padding: '.93em 1.14em', cursor: 'pointer' }} onClick={logOut}>Log Out</div>
        </Menu.Item>
      </>
      }
    </Menu.Menu>
  </Menu>
)
const addHostDispatchers = ({ props: { auth } }) => ({
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


class PlayerNavbar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  //not adding a listener with firebaseConnect as we may not know what the user's uid is until after the component has mounted
  componentDidMount() {
    console.log('​PlayerNavbar -> componentDidMount -> this.props.user', this.props.user);
    if (this.props.user) {
      this.props.firebase.ref(`games/${this.props.match.params.hostId}/client/players/${this.props.user.uid}/name`).once('value', snapshot => {
        this.setState({ name: snapshot.val() })
      })
    }
  }
  componentDidUpdate(prevProps) {
    console.log('​PlayerNavbar -> componentDidUpdate -> prevProps', prevProps);
    if (!prevProps.user && this.props.user) {
      this.props.firebase.ref(`games/${this.props.match.params.hostId}/client/players/${this.props.user.uid}/name`).once('value', snapshot => {
        this.setState({ name: snapshot.val() })
      })
    }
  }

  render() {
    console.log(this.props.user)
    return (
      <Menu attached inverted>
        <Menu.Item as={Link} to="/home">
          Peril
        </Menu.Item>
        {this.props.user &&
          <Menu.Menu position="right">
            <>
              <Menu.Item style={{ padding: 0 }}>
                <div style={{ padding: '.93em 1.14em' }}>{this.state.name}</div>
              </Menu.Item>
              <Menu.Item style={{ padding: 0 }}>
                <div style={{ padding: '.93em 1.14em', cursor: 'pointer' }} onClick={this.props.leaveGame}>Leave Game</div>
              </Menu.Item>
            </>
          </Menu.Menu>
        }
      </Menu>
    )
  }
}
const addPlayerDispatchers = (connector, ref) => {
  return {
    leaveGame() {
      // delete if game has not started, mark inactive if it has
      ref(`games/${connector.props.match.params.hostId}/client/players/${connector.props.user.uid}`).update({
        active: false
      })
      .catch(err => console.error('Error:', err))
      connector.props.user.isAnonymous && connector.props.auth.signOut()
    },
  }
}


export const HostNav = firestoreConnect(null, addHostDispatchers)(HostNavbar)
export const PlayerNav = firebaseConnect(null, addPlayerDispatchers)(PlayerNavbar)
