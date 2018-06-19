import React from 'react'
import { Button, Loader } from 'semantic-ui-react'
import { firestoreConnect } from 'fire-connect'
import { formatGame } from '../utils'

import GameInfo from './GameInfo'
import BoardCellDragAndDroppable from './BoardCellDragAndDroppable'
import HeaderCellEditable from './HeaderCellEditable'
import SelectedEdit from './SelectedEdit'


const GameInfoEdit = props => {
  return props.isLoaded ? (
    <GameInfo
      {...props}
      renderCell={(cell, multiplier, currentCoords, otherProps) => (
        <BoardCellDragAndDroppable
          cell={cell}
          multiplier={multiplier}
          currentCoords={currentCoords}
          {...otherProps}
        />
      )}
      renderHeader={(header, index, otherProps) => (
        <HeaderCellEditable
          header={header}
          index={index}
          {...otherProps}
        />
      )}
      renderQuestionInfo={({ selectedCoords }, unlock) => {
        const [row, col] = selectedCoords
        const valid = row !== null && col !== null
        const question = props.game && valid ? props.game.rows[row][col] : null
        return (
          <SelectedEdit
            question={question}
            valid={valid}
          >
            <Button
              floated="right"
              content="Remove From Game"
              onClick={() => {
                props.removeQuestionFromGame(row, col)
                unlock()
              }}
            />
            <Button
              floated="right"
              content={question && question.double ? 'Remove Daily Double' : 'Make Daily Double'}
              onClick={() => {
                props.setDouble(row, col, question.double)
              }}
            />
          </SelectedEdit>
      )}
    }
    />
  )  : <Loader active />
}

function addListener(component) {
  return component.gameRef.onSnapshot(doc => {
    if (doc.exists) {
      component.setState({ game: formatGame(doc.data()), isLoaded: true })
    } else {
      console.error('Error: document does not exist')
    }
  })
}

function addDispatchers(component, db, user) {
  component.gameRef = db
    .collection('gameTemplates')
    .doc(component.props.gameId)
    .collection('gameInfo')
    .doc('info')
  return {
    addQuestionToGame(question, row, col) {
      console.log('​addQuestionToGame -> question', row, col, question);
      const keyString = `categories.${col}.questions.${row}`
      return component.gameRef.update({
        [keyString]: question
      })
      .catch(err => console.error('Error adding question', err))
    },
    swapQuestions(questionA, rowB, colB, questionB, rowA, colA) {
      const keyStringA = `categories.${colA}.questions.${rowA}`
      const keyStringB = `categories.${colB}.questions.${rowB}`
      return component.gameRef.update({
        [keyStringA]: questionB,
        [keyStringB]: questionA
      })
      .catch(err => console.error('Error updating questions', err))
    },
    writeQuestion(question) {
      return db.collection('questions').add({
          ...question,
          author: {
            name: user.displayName,
            uid: user.uid,
          }
      })
      .catch(err => console.error('Error writing question', err))
    },
    setHeader(header, col) {
      const keyString = `categories.${col}.name`
      return component.gameRef.update({
        [keyString]: header
      })
      .catch(err => console.error('Error updating header', err))
    },
    removeQuestionFromGame(row, col) {
      const keyString = `categories.${col}.questions.${row}`
      return component.gameRef.update({
        [keyString]: null
      })
      .catch(err => console.error('Error removing question', err))
    },
    setDouble(row, col, status) {
      const keyString = `categories.${col}.questions.${row}.double`
      return component.gameRef.update({
        [keyString]: !status
      })
      .catch(err => console.error('Error changing double status', err))
    },
  }
}

export default firestoreConnect(addListener, addDispatchers)(GameInfoEdit)
