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

const GameHost = props => {
  return props.isLoaded ? (
    <div>
      <SubHeaderHost user={props.user} />
      <GameInfo
        cellComponent={BoardCell}
        headerComponent={HeaderCell}
        game={props.gameInfo}
        isLoaded={props.isLoaded}
        renderQuestionButton={question => (
          <Button
            floated="right"
            onClick={() => props.sendQuestion(question)}
          >
            Send Question to Players
          </Button>
        )}
      >
      {/* because the buttons are floated to the right, the order they are displayed in is reversed */}
        <Button floated="right">(placeholder)</Button>
      </GameInfo>
      <PlayerList players={props.players} />
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
    sendQuestion(question) {
      ref(`games/${user.uid}/client/currentQuestion`).set(question.prompt)
      .catch(err => console.log('Error:', err))
    }
  }
}

export default firebaseConnect(addListener, addDispatchers)(GameHost)
