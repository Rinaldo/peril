import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { authConnect } from '../firebase'

import GameCreation from './GameCreation'
import Navbar from './Navbar'
import SplashPage from './SplashPage'
import MyGames from './MyGames'


class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="main">
        <Navbar />
        {this.props.user ? <MyGames /> : <SplashPage />}
      </div>
    )
  }
}

export default authConnect()(Main)
