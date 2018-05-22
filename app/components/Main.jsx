import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import { authConnect } from '../fire-connect'

import GameCreation from './GameCreation'
import Navbar from './Navbar'
import SplashPage from './SplashPage'
import Home from './Home'
import GameHost from './GameHost'
import PlayerPage from './PlayerPage'


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
          <Switch>
            <Route path="/play/:hostId" component={PlayerPage} />
            {
              this.props.user ?
              <Switch>
                <Route exact path="/" render={() => <Redirect to="/home" />} />
                <Route path="/home" component={Home} />
                <Route path="/host" component={GameHost} />
                <Route path="/games/:gameId" component={GameCreation} />
              </Switch>
              :
              <Route component={SplashPage} />
            }
          </Switch>
        </Fragment>
      </Router>
    ) : <Loader />
  }
}

export default authConnect()(Main)
