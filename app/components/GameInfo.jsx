import React, { Component } from 'react'
import { Loader, Segment, Item } from 'semantic-ui-react'
import { equivalent } from '../utils'

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
    const selectedQuestion = this.props.game && coordsAreValid ? this.props.game.rows[selectedRow][selectedCol] : null
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
          {
            selectedQuestion ?
              <Item.Group>
                <Question question={selectedQuestion}>
                  {this.props.children}
                </Question>
              </Item.Group> :

            (this.props.writeQuestionAndAddToGame && coordsAreValid && this.state.locked) ?
              <QuestionInput coords={this.state.selectedCoords} writeQuestionAndAddToGame={this.props.writeQuestionAndAddToGame} /> :

            (this.props.writeQuestionAndAddToGame && coordsAreValid) ?
              'Click to create a question' :

            coordsAreValid ?
              'No question in this cell'

            : 'Hover over the board to view questions. Click a question select it.'
          }
        </Segment>
      </div>
      )
      : <Loader />
  }
}

export default GameInfo
