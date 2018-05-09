import React, { Component } from 'react'
import { Segment, Item, Loader } from 'semantic-ui-react'
import { db } from '../firebase'
import { equivalent, formatGame } from '../utils'

import Board from './Board'
import Question from './Question'
import QuestionInput from './QuestionInput'


class GameInfo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      init: true,
      selectedCoords: [null, null],
      selectedIsLocked: false,
    }
    this.getCell = this.getCell.bind(this)
    this.selectQuestion = this.selectQuestion.bind(this)
    this.toggleLock = this.toggleLock.bind(this)
    this.clearQuestion = this.clearQuestion.bind(this)
    this.addQuestionToGame = this.addQuestionToGame.bind(this)
    this.swapQuestions = this.swapQuestions.bind(this)
    this.writeQuestion = this.writeQuestion.bind(this)
    this.setHeader = this.setHeader.bind(this)
  }

  componentDidMount() {
    this.gameRef = db
    .collection('gameTemplates')
    .doc('xAhHuSSb01guhLrh7nvj')
    .collection('gameInfo')
    .doc('info')
    this.unsubscribe = this.gameRef.onSnapshot(doc => {
      if (doc.exists) {
        this.setState({ gameInfo: formatGame(doc.data()), init: false })
      } else {
        this.gameRef.set({
          multiplier: 200,
          height: 5,
          width: 6,
        })
        .catch(err => console.log('Error creating document', err))
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  addQuestionToGame(question, row, col) {
    const keyString = `categories.${col}.questions.${row}`
    return this.gameRef.update({
      [keyString]: question
    })
  }

  swapQuestions(questionA, bRow, bCol, questionB, aRow, aCol) {
    const keyStringA = `categories.${aCol}.questions.${aRow}`
    const keyStringB = `categories.${bCol}.questions.${bRow}`
    this.gameRef.update({
      [keyStringA]: questionB,
      [keyStringB]: questionA
    })
    .then(() => console.log('updated successfully'))
    .catch(err => console.log('Error updating document', err))
  }

  writeQuestion(prompt, response, isPublic) {
    db.collection('questions').add({
        prompt,
        response,
        isPublic,
    })
    .then(docRef => docRef.get())
    .then(doc => this.addQuestionToGame(doc.data(), ...this.state.selectedCoords))
    .catch(err => console.log('Error writing document', err))
  }

  setHeader(header, col) {
    const keyString = `categories.${col}.name`
    this.gameRef.update({
      [keyString]: header
    })
    .then(() => console.log('updated successfully'))
    .catch(err => console.log('Error updating document', err))
  }

  getCell(event) {
    return [+event.target.getAttribute('row'), +event.target.getAttribute('col')]
  }
  selectQuestion(event, force, coords) {
    const selectedCoords = event ? this.getCell(event) : coords
    if (!this.state.selectedIsLocked || force) this.setState({ selectedCoords })
  }
  toggleLock(event) {
    const currentCoords = this.getCell(event)
    const { selectedCoords, selectedIsLocked } = this.state

    if (equivalent(currentCoords, selectedCoords) && selectedIsLocked) {
      this.setState({ selectedIsLocked: false })
    } else {
      this.selectQuestion(event, true)
      this.setState({ selectedIsLocked: true })
    }
  }
  clearQuestion() {
    if (!this.state.selectedIsLocked) this.setState({ selectedCoords: [null, null] })
  }

  render() {
    const { gameInfo, selectedIsLocked, selectedCoords } = this.state
    const [selectedRow, selectedCol] = selectedCoords
    const coordsAreValid = selectedRow !== null && selectedCol !== null
    const selectedQuestion = coordsAreValid ? gameInfo.rows[selectedRow][selectedCol] : null
    return !this.state.init ? (
      <div>
        <Board
          game={gameInfo}
          selectedCoords={selectedCoords}
          locked={selectedIsLocked}
          selectQuestion={this.selectQuestion}
          toggleLock={this.toggleLock}
          clearQuestion={this.clearQuestion}
          addQuestionToGame={this.addQuestionToGame}
          swapQuestions={this.swapQuestions}
          setHeader={this.setHeader}
        />
        <Segment attached>
        {selectedQuestion ?
          <Item.Group>
            <Question question={selectedQuestion} />
          </Item.Group>
          : coordsAreValid && selectedIsLocked ? <QuestionInput writeQuestion={this.writeQuestion} />
          : coordsAreValid ? 'Click to create a question'
          : 'Hover over the board to view questions. Click a question select it.'}
        </Segment>
      </div>
      )
      : <Loader />
  }
}

export default GameInfo
