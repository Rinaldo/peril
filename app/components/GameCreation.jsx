import React, { Component } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import GameInfoEdit from './GameInfoEdit'
import QuestionList from './QuestionList'
import SubHeader from './SubHeader'

/* eslint-disable react/prefer-stateless-function */
// react-dnd requires DragDropContext to be passed a stateful function
class GameCreation extends Component {
  render() {
    // console.log('gameId:', this.props.game && this.props.game.docId)
    return (
      <React.Fragment>
        <SubHeader gameId={this.props.match.params.gameId} history={this.props.history} />
        <div className="game-creation">
          <GameInfoEdit gameId={this.props.match.params.gameId} />
          <QuestionList />
        </div>
      </React.Fragment>
    )
  }
}

export default DragDropContext(HTML5Backend)(GameCreation)
