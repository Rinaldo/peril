import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { authConnect, firebaseConnect } from 'fire-connect'
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
const addHostDispatchers = (connector, auth) => ({
  logOut() {
    auth.signOut()
  },

  googleLogin() {
    auth.signInWithPopup(googleProvider)
    .catch(err => console.error('Sign up or sign in error:', err))
  },

  emailLogin(email, password) {
    auth.signInWithEmailAndPassword(email, password)
    .catch(err => console.error('Sign up or sign in error:', err))
  },

  emailSignup(email, password, name) {
    auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => Promise.all([userCredential.user, userCredential.user.updateProfile({ displayName: name })]))
    .then(([user]) => user.getIdToken(true))
    .catch(err => console.error('Sign up or sign in error:', err))
  }
})


class PlayerNavbar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    //not adding a listener with firebaseConnect as we may not know what the user's uid is until after the component has mounted
    this.addListener = () => {
      this.callback = snapshot => {if (snapshot.exists()) this.setState({ player: snapshot.val() })}
      this.ref = this.props.database.ref(`games/${this.props.match.params.hostId}/client/players/${this.props.user.uid}`)
      this.ref.on('value', this.callback)
    }
    this.removeListener = () => {
      this.ref.off('value', this.callback)
      this.setState({ player: undefined })
    }
  }
  componentDidMount() {
    if (this.props.user) {
      this.addListener()
    }
  }
  componentDidUpdate(prevProps) {
    console.log('updating', prevProps, this.props)
    if (!prevProps.user && this.props.user) {
      this.addListener()
    } else if (prevProps.user && !this.props.user) {
      this.removeListener()
    }
  }

  componentWillUnmount() {
    this.removeListener()
  }

  render() {
    return (
      <Menu attached inverted>
        <Menu.Item as={Link} to="/home">
          Peril
        </Menu.Item>
        {(this.props.user && this.state.player && this.state.player.active) &&
          <Menu.Menu position="right">
            <>
              <Menu.Item style={{ padding: 0 }}>
                <div style={{ padding: '.93em 1.14em' }}>{this.state.player.name}</div>
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
      // todo: delete if game has not started, mark inactive if it has, something if game has ended
      ref(`games/${connector.props.match.params.hostId}/client/players/${connector.props.user.uid}`).update({
        active: false
      })
      .catch(err => console.error('Error:', err))
    },
  }
}


export const HostNav = authConnect(addHostDispatchers)(HostNavbar)
export const PlayerNav = firebaseConnect(null, addPlayerDispatchers)(PlayerNavbar)
