import React, { Component } from 'react'
import { Segment, Item, Loader } from 'semantic-ui-react'
import { equivalent, formatGame } from '../utils'
import { fireAuthConnect } from '../firebase'

import Board from './Board'
import BoardCell from './BoardCell'
import HeaderCell from './HeaderCell'
import Question from './Question'
import QuestionInput from './QuestionInput'


class GameInfo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedCoords: [null, null],
      locked: false,
    }
    this.getCell = this.getCell.bind(this)
    this.selectQuestion = this.selectQuestion.bind(this)
    this.toggleLock = this.toggleLock.bind(this)
    this.clearQuestion = this.clearQuestion.bind(this)
    // // binding it so it has access to both the connector's state and this component's state
    // this.writeQuestionAndAddToGame = this.props.writeQuestionAndAddToGame.bind(this)
  }

  getCell(event) {
    return [+event.target.getAttribute('row'), +event.target.getAttribute('col')]
  }
  selectQuestion(event, force, coords) {
    const selectedCoords = event ? this.getCell(event) : coords
    // console.log('coords', selectedCoords, ' arg', coords)
    if (!this.state.locked || force) this.setState({ selectedCoords })
  }
  toggleLock(event) {
    const currentCoords = this.getCell(event)
    const { selectedCoords, locked } = this.state

    if (equivalent(currentCoords, selectedCoords) && locked) {
      this.setState({ locked: false })
    } else {
      this.selectQuestion(event, true)
      this.setState({ locked: true })
    }
  }
  clearQuestion() {
    if (!this.state.locked) this.setState({ selectedCoords: [null, null] })
  }

  render() {
    const [selectedRow, selectedCol] = this.state.selectedCoords
    const coordsAreValid = selectedRow !== null && selectedCol !== null
    const selectedQuestion = coordsAreValid && this.props.game ? this.props.game.rows[selectedRow][selectedCol] : null
    return this.props.isLoaded ? (
      <div>
        <Board
          cellComponent={BoardCell}
          headerComponent={HeaderCell}
          {...this.props}
          {...this.state}
          selectQuestion={this.selectQuestion}
          toggleLock={this.toggleLock}
          clearQuestion={this.clearQuestion}
        />
        <Segment attached>
        {selectedQuestion ?
          <Item.Group>
            <Question question={selectedQuestion} />
          </Item.Group>
          : coordsAreValid && this.state.locked ? <QuestionInput coords={this.state.selectedCoords} writeQuestionAndAddToGame={this.props.writeQuestionAndAddToGame} />
          : coordsAreValid ? 'Click to create a question'
          : 'Hover over the board to view questions. Click a question select it.'}
        </Segment>
      </div>
      )
      : <Loader />
  }
}

function addListener(component) {
  return component.gameRef.onSnapshot(doc => {
    if (doc.exists) {
      // console.log('doc', doc)
      component.setState({ game: formatGame(doc.data()), isLoaded: true })
    } else {
      console.error('Error: document does not exist')
    }
  })
}

function addDispatchers(component, db) {
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
            name: component.state.user.displayName,
            uid: component.state.user.uid,
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

export default fireAuthConnect(addListener, addDispatchers)(GameInfo)
