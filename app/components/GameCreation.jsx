import React, { Component } from 'react'

import Board from './Board'
import Questions from './Questions'


class GameCreation extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="game-creation">
        <Board />
        <Questions />
      </div>
    )
  }
}

export default GameCreation
