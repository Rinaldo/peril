import React, { Component } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import GameInfoEdit from './GameInfoEdit'
import QuestionList from './QuestionList'
import SubHeader from './SubHeader'
import QuestionDraggable from './QuestionDraggable'

/* eslint-disable react/prefer-stateless-function */
// react-dnd requires DragDropContext to be passed a stateful function
class GameCreation extends Component {
  render() {
    // console.log('gameId:', this.props.game && this.props.game.docId)
    return (
      <div style={{ height: '100%' }}>
        <SubHeader gameId={this.props.match.params.gameId} history={this.props.history} />
        <div style={{ display: 'flex', height: 'calc(100% - 120px)' }}>
          <div style={{ width: '75%', height: '100%' }}>
            <GameInfoEdit gameId={this.props.match.params.gameId} />
          </div>
          <div style={{ width: '25%', height: '100%', minWidth: '300px' }}>
            <QuestionList questionItem={
                question => <QuestionDraggable key={question.docId} question={question} />
              }
            />
          </div>
        </div>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(GameCreation)
