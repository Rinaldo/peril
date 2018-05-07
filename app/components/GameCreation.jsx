import React, { Component } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

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

export default DragDropContext(HTML5Backend)(GameCreation)
