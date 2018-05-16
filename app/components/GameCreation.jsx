import React, { Component } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import GameInfo from './GameInfo'
import QuestionList from './QuestionList'

/* eslint-disable react/prefer-stateless-function */
class GameCreation extends Component {

  render() {
    return (
      <div className="game-creation">
        <GameInfo gameId={this.props.match.params.gameId} />
        <QuestionList />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(GameCreation)
