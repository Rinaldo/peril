import React, { Component } from 'react'
import { Segment, Item, Loader } from 'semantic-ui-react'
import { equivalent, formatGame } from '../utils'
import { fireConnect } from '../firebase'

import Board from './Board'
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
    // binding so it has access to both the connector's state and this component's state
    this.writeQuestion = this.props.writeQuestion.bind(this)
  }

  getCell(event) {
    return [+event.target.getAttribute('row'), +event.target.getAttribute('col')]
  }
  selectQuestion(event, force, coords) {
    const selectedCoords = event ? this.getCell(event) : coords
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
    const selectedQuestion = coordsAreValid ? this.props.game.rows[selectedRow][selectedCol] : null

    return this.props.isLoaded ? (
      <div>
        <Board
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
          : coordsAreValid && this.state.locked ? <QuestionInput writeQuestion={this.writeQuestion} />
          : coordsAreValid ? 'Click to create a question'
          : 'Hover over the board to view questions. Click a question select it.'}
        </Segment>
      </div>
      )
      : <Loader />
  }
}

function addListener(component, db) {
  component.gameRef = db
    .collection('gameTemplates')
    .doc('xAhHuSSb01guhLrh7nvj')
    .collection('gameInfo')
    .doc('info')
  return component.gameRef.onSnapshot(doc => {
    if (doc.exists) {
      component.setState({ game: formatGame(doc.data()), isLoaded: true })
    } else {
      component.gameRef.set({
        multiplier: 200,
        height: 5,
        width: 6,
      })
      .catch(err => console.error('Error creating document', err))
    }
  })
}

function addDispatchers(component, db) {
  return {
    addQuestionToGame(question, row, col) {
      const keyString = `categories.${col}.questions.${row}`
      return component.gameRef.update({
        [keyString]: question
      })
    },
    swapQuestions(questionA, bRow, bCol, questionB, aRow, aCol) {
      const keyStringA = `categories.${aCol}.questions.${aRow}`
      const keyStringB = `categories.${bCol}.questions.${bRow}`
      component.gameRef.update({
        [keyStringA]: questionB,
        [keyStringB]: questionA
      })
      .catch(err => console.error('Error updating document', err))
    },
    writeQuestion(prompt, response, isPublic) {
      db.collection('questions').add({
          prompt,
          response,
          isPublic,
      })
      .then(docRef => docRef.get())
      .then(doc => component.dispatchers.addQuestionToGame(doc.data(), ...this.state.selectedCoords))
      .catch(err => console.error('Error updating document', err))
    },
    setHeader(header, col) {
      const keyString = `categories.${col}.name`
      component.gameRef.update({
        [keyString]: header
      })
      .catch(err => console.error('Error updating document', err))
    },
  }
}

export default fireConnect(addListener, addDispatchers)(GameInfo)
