import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import { authConnect } from '../firebase'

import GameCreation from './GameCreation'
import Navbar from './Navbar'
import SplashPage from './SplashPage'
import Home from './Home'
import GameHost from './GameHost'


class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return this.props.user !== undefined ? (
      <Router>
        <Fragment>
          <Navbar />
          {
            this.props.user ?
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/home" />} />
              <Route path="/home" component={Home} />
              <Route path="/games/:gameId/host" component={GameHost} />
              <Route path="/games/:gameId" component={GameCreation} />
            </Switch>
            :
            <Route component={SplashPage} />
          }
        </Fragment>
      </Router>
    ) : <Loader />
  }
}

export default authConnect()(Main)
