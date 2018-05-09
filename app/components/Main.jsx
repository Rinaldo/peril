import React, { Component } from 'react'
import { db, auth, provider } from '../firebase'

import GameCreation from './GameCreation'
import Navbar from './Navbar'
import LoginForm from './LoginForm'


class Main extends Component {

  constructor(props) {
    super(props)
    this.state = { user: null }
    // this.login = this.login.bind(this)
    // this.logout = this.logout.bind(this)
  }

  // componentDidMount() {
  //   auth.onAuthStateChanged((user) => {
  //     console.log('auth state change in main')
  //     if (user) {
  //       this.setState({ user })
  //     }
  //   })
  // }

  // logout() {
  //   auth.signOut()
  //   .then(() => {
  //     this.setState({ user: null })
  //   })
  // }
  // login() {
  //   console.log('logging in...')
  //   //returns an object containing the user object along with other info
  //   auth.signInWithPopup(provider)
  //     .then((result) => {
  //       console.log('result in main:', result)
  //       const user = result.user
  //       this.setState({ user })

  //       const userRef = db.collection('users').doc(user.uid)
  //       userRef.set({
  //         displayName: user.displayName,
  //       }, { merge: true })
  //       .then(() => {
  //         return userRef.collection('privateInfo').doc(user.uid).set({
  //           email: user.email,
  //           emailVerified: user.emailVerified,
  //           phoneNumber: user.phoneNumber,
  //           photoURL: user.photoURL,
  //           isAnonymous: user.isAnonymous,
  //         }, { merge: true })
  //       })
  //       .then(() => console.log('document created successfully!'))
  //       .catch(error => console.log('error:', error))
  //     })
  //     .catch(error => console.log('error:', error))
  // }

  render() {
    // console.log('user on state:', this.state.user)
    return (
      <div className="main">
        {/* <h1>Auth Test</h1>
        {this.state.user ?
          <button onClick={this.logout}>Log Out</button>
          :
          <LoginForm />
        } */}
        <Navbar />
        <GameCreation />
      </div>
    )
  }
}

export default Main
