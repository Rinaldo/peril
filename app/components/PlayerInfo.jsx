import React, { Component } from 'react'
import { Loader, Menu, Segment } from 'semantic-ui-react'
import { firebaseConnect } from 'fire-connect'
import { listPlayersByScore, playerResponsesByTime } from '../utils'

import PlayerList from './PlayerList'
import ResponseQueue from './ResponseQueue'


class PlayerInfo extends Component {
  constructor(props) {
    super(props)
    this.state = { display: 'Players' }
    this.setDisplay = this.setDisplay.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentQuestion && prevState.display === 'Players') {
      return { display: 'Responses' }
    } else if (!nextProps.currentQuestion && prevState.display === 'Responses') {
      return { display: 'Players' }
    } else {
      return null
    }
  }

  setDisplay(_, { name }) {
    this.setState({ display: name })
  }

  render() {
    console.log(this.state.display)
    return this.props.isLoaded ? (
      <div style={{ height: '100%' }}>
        <Menu attached widths={2}>
          <Menu.Item
            active={this.state.display === 'Players'}
            name="Players"
            onClick={this.setDisplay}
          />
          <Menu.Item
            active={this.state.display === 'Responses'}
            name="Responses"
            onClick={this.setDisplay}
            />
        </Menu>
        <Segment attached style={{ overflowY: 'auto', height: 'calc(100% - 40px)' }}>
          {this.state.display === 'Players' &&
            <PlayerList
              players={this.props.players}
              removePlayer={this.props.removePlayer}
            />
          }
          {this.state.display === 'Responses' &&
            <ResponseQueue
              responses={this.props.responses}
              markAsCorrect={this.props.markAsCorrect}
              markAsIncorrect={this.props.markAsIncorrect}
            />
          }
        </Segment>
      </div>
    ) : <Loader active />
  }
}

function addListener(component, ref, user) {
  return ref(`games/${user.uid}/client`).on('value', snapshot => {
    if (!snapshot.exists()) {
      console.log('no game found')
      return
    }
    const { players, responseQueue, currentQuestion } = snapshot.val()
    component.setState({
      currentQuestion,
      players: players ? listPlayersByScore(players) : [],
      responses: players && responseQueue ? playerResponsesByTime(players, responseQueue) : [],
      isLoaded: true
    })
  })
}

function addDispatchers(component, ref, user) {
  return {
    startGame() {
      ref(`games/${user.uid}/client/started`).set(true)
        .catch(err => console.log('Error:', err))
    },
    removePlayer(player) {
      ref(`games/${user.uid}/client/players/${player.uid}`).remove()
    },
    markAsCorrect(player) {
      const { row, col, points, double } = component.state.currentQuestion
      // should be a transaction
      ref(`games/${user.uid}/client/players/${player.uid}`).update({
        score: player.score + (double ? points * 2 : points)
      })
      ref(`games/${user.uid}/client/gameInfo/categories/${col}/questions/${row}`).update({
        answerer: player.uid,
      })
      ref(`games/${user.uid}/host/gameInfo/categories/${col}/questions/${row}`).update({
        answerer: player.uid,
      })
      ref(`games/${user.uid}/client/currentQuestion`).remove()
      ref(`games/${user.uid}/client/responseQueue`).remove()
    },
    markAsIncorrect(player) {
      const { points, double } = component.state.currentQuestion
      // should be a transaction
      ref(`games/${user.uid}/client/players/${player.uid}`).update({
        score: player.score - (double ? points * 2 : points)
      })
      if (component.state.responses.length === 1) {
        ref(`games/${user.uid}/client/currentQuestion`).remove()
      }
      ref(`games/${user.uid}/client/responseQueue/${player.uid}`).remove()
    }
  }
}

export default firebaseConnect(addListener, addDispatchers)(PlayerInfo)
