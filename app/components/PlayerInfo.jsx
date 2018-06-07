import React from 'react'
import { firebaseConnect } from '../fire-connect'
import { listPlayersByScore, playerResponsesByTime } from '../utils'

import PlayerList from './PlayerList'
import ResponseQueue from './ResponseQueue'


const GameHost = props => {
  return props.isLoaded ? (
    <>
      <PlayerList
        players={props.players}
        removePlayer={props.removePlayer}
      />
      <ResponseQueue
        responses={props.responses}
        markAsCorrect={props.markAsCorrect}
        markAsIncorrect={props.markAsIncorrect}
      />
    </>
  ) : null
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

export default firebaseConnect(addListener, addDispatchers)(GameHost)
