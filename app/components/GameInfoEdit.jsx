import React from 'react'
import { Button } from 'semantic-ui-react'
import { firestoreConnect } from '../fire-connect'
import { formatGame } from '../utils'

import GameInfo from './GameInfo'
import BoardCellDragAndDroppable from './BoardCellDragAndDroppable'
import HeaderCellEditable from './HeaderCellEditable'


const GameInfoEdit = props => {
  return (
    <GameInfo
      cellComponent={BoardCellDragAndDroppable}
      headerComponent={HeaderCellEditable}
      {...props}
    >
      {/* because the buttons are floated to the right, the order they are displayed in is reversed */}
      <Button floated="right">Delete (placeholder)</Button>
      <Button floated="right">Edit (placeholder)</Button>
    </GameInfo>
  )
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
      const keyString = `categories.${col}.questions.${row}`
      return component.gameRef.update({
        [keyString]: question
      })
      .catch(err => console.error('Error adding question', err))
    },
    swapQuestions(questionA, bRow, bCol, questionB, aRow, aCol) {
      const keyStringA = `categories.${aCol}.questions.${aRow}`
      const keyStringB = `categories.${bCol}.questions.${bRow}`
      component.gameRef.update({
        [keyStringA]: questionB,
        [keyStringB]: questionA
      })
      .catch(err => console.error('Error updating questions', err))
    },
    writeQuestionAndAddToGame(question, row, col) {
      db.collection('questions').add({
          ...question,
          author: {
            name: user.displayName,
            uid: user.uid,
          }
      })
      .then(docRef => docRef.get())
      .then(doc => component.dispatchers.addQuestionToGame(doc.data(), row, col))
      .catch(err => console.error('Error writing question', err))
    },
    setHeader(header, col) {
      const keyString = `categories.${col}.name`
      component.gameRef.update({
        [keyString]: header
      })
      .catch(err => console.error('Error updating header', err))
    },
  }
}

export default firestoreConnect(addListener, addDispatchers)(GameInfoEdit)
