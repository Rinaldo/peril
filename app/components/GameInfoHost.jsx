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
          return (
          <SelectedHost
            question={question}
            valid={valid}
          >
          <Button
            floated="right"
            content="Send Question to Players (placeholder)"
            onClick={() => props.sendQuestion(question, row, col)}
            // disabled if game hasn't started or there is a currentQuestion
          />
          </SelectedHost>
        )}
      }
      />
    </div>
  ) : null
}

function addListener(component, ref, user) {
  return ref(`games/${user.uid}/host`).on('value', snapshot => {
    if (!snapshot.exists()) {
      console.log('no game found')
      return
    }
    const { gameInfo } = snapshot.val()
    component.setState({
      gameInfo: formatGame(gameInfo),
      isLoaded: true
    })
  })
}

function addDispatchers(component, ref, user) {
  return {
    sendQuestion(question, row, col) {
      console.log(question)
      ref(`games/${user.uid}/client/currentQuestion`).set({
        prompt: question.prompt,
        points: question.points,
        row,
        col,
      })
      .catch(err => console.log('Error:', err))
    },
  }
}

export default firebaseConnect(addListener, addDispatchers)(GameHost)
