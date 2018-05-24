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

const GameHost = props => {
  return props.isLoaded ? (
    <div>
      <SubHeaderHost user={props.user} startGame={props.startGame} />
      <GameInfo
        game={props.gameInfo}
        isLoaded={props.isLoaded}
        renderCell={(cell, multiplier, currentCoords, otherProps) => (
          <BoardCell
            cell={cell}
            multiplier={multiplier}
            currentCoords={currentCoords}
            {...otherProps}
          />
        )}
        renderHeader={(header, index, otherProps) => (
          <HeaderCell
            header={header}
            index={index}
            {...otherProps}
          />
        )}
        renderQuestionInfo={({ selectedCoords }) => {
          const [row, col] = selectedCoords
          const valid = row !== null && col !== null
          const question = props.gameInfo && valid ? props.gameInfo.rows[row][col] : null
          console.log(question)
          return (
          <SelectedHost
            question={question}
            valid={valid}
          >
          <Button
            floated="right"
            content="Send Question to Players (placeholder)"
            onClick={() => props.sendQuestion(question)}
          />
          </SelectedHost>
        )}
      }
      />
      <PlayerList players={props.players} removePlayer={props.removePlayer} />
      <ResponseQueue players={props.players} responseQueue={props.responseQueue} markAsAnswered={props.markAsAnswered} />
    </div>
  ) : null
}

function addListener(component, ref, user) {
  return ref(`games/${user.uid}`).on('value', snapshot => {
    if (!snapshot.exists()) {
      console.log('no game found')
      return
    }
    const { client, host } = snapshot.val()
    component.setState({
      // game,
      gameInfo: formatGame(host.gameInfo),
      players: client.players || {},
      responseQueue: client.responseQueue || {},
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
    sendQuestion(question) {
      ref(`games/${user.uid}/client/currentQuestion`).set(question.prompt)
        .catch(err => console.log('Error:', err))
    },
    removePlayer(player) {
      ref(`games/${user.uid}/client/players/${player.uid}`).remove()
    },
    markAsAnswered(player, question) {
      ref(`games/${user.uid}/client/players/${player.uid}`).update({
        score: player.score + question.points
      })
    }
  }
}

export default firebaseConnect(addListener, addDispatchers)(GameHost)
