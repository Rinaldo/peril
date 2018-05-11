import React from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import GameInfo from './GameInfo'
import QuestionList from './QuestionList'


const GameCreation = () => {

    return (
      <div className="game-creation">
        <GameInfo />
        <QuestionList />
      </div>
    )
}

export default DragDropContext(HTML5Backend)(GameCreation)
