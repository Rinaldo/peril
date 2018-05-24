import React from 'react'
import { Button, Loader } from 'semantic-ui-react'
import { firestoreConnect } from '../fire-connect'
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
      renderQuestionInfo={({ selectedCoords, locked }) => {
        const [row, col] = selectedCoords
        const valid = row !== null && col !== null
        const question = props.game && valid ? props.game.rows[row][col] : null
        return (
        <SelectedEdit
          question={question}
          coords={selectedCoords}
          valid={valid}
          locked={locked}
          writeQuestion={props.writeQuestion}
          addQuestionToGame={props.addQuestionToGame}
        >
          <Button
            floated="right"
            content="Remove From Game (placeholder)"
          />
          <Button
            floated="right"
            content="Edit (placeholder)"
            //should open up edit box in same place
          />
        </SelectedEdit>
      )}
    }
    />
  )  : <Loader />
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
  }
}

export default firestoreConnect(addListener, addDispatchers)(GameInfoEdit)
