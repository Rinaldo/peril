import React from 'react'
import { firestoreConnect } from 'fire-connect'

import GameListItem from './GameListItem'
import GameList from './GameList'
import Question from './Question'
import QuestionList from './QuestionList'
import GameCreationModal from './GameCreationModal'
import QuestionInputModal from './QuestionInputModal'

import { createNewQuestionDispatcher, createNewGameDispatcher } from '../fireConnectCommon'

const Home = props => {
  return (
  <div style={{ height: '100%', padding: '2%' }}>
    <div style={{ height: '100%', display: 'flex' }}>
      <div style={{ height: '92%', width: '50%', padding: '2%' }}>
        <GameCreationModal
          createGame={props.createGame}
          initialState={{
            isPublic: true,
            height: 5,
            width: 6,
            multiplier: 200,
          }}
        />
        <GameList
          emptyListMessage="No Games found. Click the button above to create one"
          renderItem={game => <GameListItem key={game.docId} game={game} />}
        />
      </div>
      <div style={{ height: '92%', width: '50%', padding: '2%' }}>
        <QuestionInputModal
          writeQuestion={props.writeQuestion}
          initialState={{ isPublic: true }}
        />
        <QuestionList
          emptyListMessage="No Questions found. Click the button above to create one"
          renderItem={question => <Question key={question.docId} question={question} />}
        />
      </div>
    </div>
  </div>
  )
}

function addDispatchers(connector, db, user) {
  return {
    createGame(game) {
      return createNewGameDispatcher(connector, db, user)(game)
    },
    writeQuestion(question) {
      return createNewQuestionDispatcher(connector, db, user)(question)
    }
  }
}

export default firestoreConnect(null, addDispatchers)(Home)
