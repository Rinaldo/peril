import React, { Component } from 'react'
import { Segment, Item, Loader } from 'semantic-ui-react'
import { db } from '../firebase'
import { equivalent, formatGame } from '../utils'

import Board from './Board'
import Question from './Question'


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
    this.saveQuestion = this.saveQuestion.bind(this)
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

  saveQuestion(question, rowIndex, colIndex) {
    const keyString = `categories.${colIndex}.questions.${rowIndex}`
    this.gameRef.update({
      [keyString]: question
    })
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
    const selectedQuestion =
      selectedRow !== null && selectedCol !== null ? gameInfo.rows[selectedRow][selectedCol]
      : null
    return !this.state.init ? (
      <div>
        <Board
          game={gameInfo}
          selectedCoords={selectedCoords}
          locked={selectedIsLocked}
          selectQuestion={this.selectQuestion}
          toggleLock={this.toggleLock}
          clearQuestion={this.clearQuestion}
          saveQuestion={this.saveQuestion}
        />
        <Segment attached="bottom">
        {selectedQuestion ?
          <Item.Group>
            <Question question={selectedQuestion} />
          </Item.Group>
          : 'Hover over the board to view questions. Click a question to lock the selection.'}
        </Segment>
      </div>
      )
      : <Loader />
  }
}

export default GameInfo
