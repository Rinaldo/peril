import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import { authConnect } from '../fire-connect'

import GameCreation from './GameCreation'
import { HostNav, PlayerNav } from './Navbar'
import SplashPage from './SplashPage'
import Home from './Home'
import GameHost from './GameHost'
import PlayerPage from './PlayerPage'


const PlayerRouter = props => (
  <Fragment>
    <PlayerNav match={props.match} />
    <div style={{height: 'calc(100% - 48px)'}}>
      <PlayerPage match={props.match} />
    </div>
  </Fragment>
)

const HostRouter = ({ user }) => (
  <Fragment>
    <HostNav />
    <div style={{height: 'calc(100% - 48px)'}}>
      {
        user && !user.isAnonymous ?
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route path="/home" component={Home} />
          <Route path="/host" component={GameHost} />
          <Route path="/games/:gameId" component={GameCreation} />
        </Switch>
        :
        <Route component={SplashPage} />
      }
    </div>
  </Fragment>
)

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
          <Switch>
            <Route path="/play/:hostId" component={PlayerRouter} />
            <Route render={() => <HostRouter user={this.props.user} />} />
          </Switch>
        </Router>
        : <Loader active />}
      </div>
    )
  }
}

export default authConnect()(Main)
