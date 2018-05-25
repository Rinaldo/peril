import React from 'react'
import { Button } from 'semantic-ui-react'
import { firebaseConnect } from '../fire-connect'
import { formatGame } from '../utils'

// import Board from './Board'
import GameInfo from './GameInfo'
import BoardCell from './BoardCell'
import HeaderCell from './HeaderCell'
import PlayerList from './PlayerList'
import SubHeaderHost from './SubHeaderHost'
import SelectedHost from './SelectedHost'
import ResponseQueue from './ResponseQueue'
import GameInfoHost from './GameInfoHost'


const GameHost = props => {
  return props.isLoaded ? (
    <div>
      <SubHeaderHost user={props.user} startGame={props.startGame} />
      <GameInfoHost />
      <PlayerList players={props.players} removePlayer={props.removePlayer} />
      <ResponseQueue players={props.players} currentQuestion={props.currentQuestion} responseQueue={props.responseQueue} markAsAnswered={props.markAsAnswered} incorrectAnswer={props.incorrectAnswer} />
    </div>
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
      players: players || {},
      currentQuestion,
      responseQueue: responseQueue || {},
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
    markAsAnswered(player, question) {
      // should be a transaction
      ref(`games/${user.uid}/client/players/${player.uid}`).update({
        score: player.score + question.points
      })
      ref(`games/${user.uid}/client/gameInfo/categories/${question.col}/questions/${question.row}`).update({
        answerer: player.uid
      })
      ref(`games/${user.uid}/host/gameInfo/categories/${question.col}/questions/${question.row}`).update({
        answerer: player.uid
      })
      ref(`games/${user.uid}/client/currentQuestion`).remove()
      ref(`games/${user.uid}/client/responseQueue`).remove()
    },
    incorrectAnswer(player, question) {
      // should be a transaction
      ref(`games/${user.uid}/client/players/${player.uid}`).update({
        score: player.score - question.points
      })
      ref(`games/${user.uid}/client/responseQueue/${player.uid}`).remove()
      // if no responses left, clear currentQuestion
    }
  }
}

export default firebaseConnect(addListener, addDispatchers)(GameHost)
