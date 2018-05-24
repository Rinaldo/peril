import React, { Component } from 'react'
import { equivalent } from '../utils'

import Board from './Board'

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
    // const [selectedRow, selectedCol] = this.state.selectedCoords
    // const coordsAreValid = selectedRow !== null && selectedCol !== null
    // const selectedQuestion = this.props.game && coordsAreValid ? this.props.game.rows[selectedRow][selectedCol] : null
    return (
      <div>
        <Board
          {...this.props}
          {...this.state}
          selectQuestion={this.selectQuestion}
          toggleLock={this.toggleLock}
          clearQuestion={this.clearQuestion}
        />
        {this.props.renderQuestionInfo(this.state)}
      </div>
      )
  }
}

export default GameInfo
