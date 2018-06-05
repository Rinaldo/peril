import React from 'react'
import { Button, Loader } from 'semantic-ui-react'
import { firebaseConnect } from '../fire-connect'
import { formatGame } from '../utils'

import GameInfo from './GameInfo'
import BoardCell from './BoardCell'
import HeaderCell from './HeaderCell'
import SelectedHost from './SelectedHost'


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
              content="Send Question to Players"
              onClick={() => props.sendQuestion(question, row, col)}
              disabled={!!props.currentQuestion || !props.started || (question && question.asked)}
            />
          </SelectedHost>
        )}
      }
      />
    </div>
  ) : <Loader active />
}

function addListener(component, ref, user) {
  return {
    host: () => ref(`games/${user.uid}/host`).on('value', snapshot => {
      if (!snapshot.exists()) {
        console.log('no game found')
        return
      }
      const { gameInfo } = snapshot.val()
      component.setState({
        gameInfo: formatGame(gameInfo),
        isLoaded: true
      })
    }),
    currentQuestion: () => ref(`games/${user.uid}/client/currentQuestion`).on('value', snapshot => {
      component.setState({ currentQuestion: snapshot.val() })
    }),
    started: () => ref(`games/${user.uid}/client/started`).on('value', snapshot => {
      component.setState({ started: snapshot.val() })
    })
  }
}

function addDispatchers(component, ref, user) {
  return {
    sendQuestion(question, row, col) {
      console.log(question)
      ref(`games/${user.uid}/client/gameInfo/categories/${col}/questions/${row}`).update({
        asked: true
      })
      ref(`games/${user.uid}/host/gameInfo/categories/${col}/questions/${row}`).update({
        asked: true
      })
      ref(`games/${user.uid}/client/currentQuestion`).set({
        prompt: question.prompt,
        points: question.points,
        double: question.double || null,
        row,
        col,
      })
      .catch(err => console.log('Error:', err))
    },
  }
}

export default firebaseConnect(addListener, addDispatchers)(GameHost)
