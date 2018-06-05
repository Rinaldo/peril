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
    return (
      <div style={{height: '100vh', width: '100vw'}}>
        {this.props.user !== undefined ?
        <Router>
          <Fragment>
            <Navbar />
            <div style={{height: 'calc(100% - 48px)'}}>
              <Switch>
                <Route path="/play/:hostId" component={PlayerPage} />
                {
                  this.props.user && !this.props.user.isAnonymous ?
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
            </div>
          </Fragment>
        </Router>
        : <Loader active />}
      </div>
    )
  }
}

export default authConnect()(Main)
