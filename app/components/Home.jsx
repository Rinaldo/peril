import React from 'react'
import { firestoreConnect } from 'fire-connect'

import MyGames from './MyGames'
import QuestionList from './QuestionList'
import Question from './Question'
import GameCreationModal from './GameCreationModal'
import QuestionInputModal from './QuestionInputModal'

const Home = props => {
  // console.log('home props', props)
  return (
  <div style={{ height: '100%', padding: '2%' }}>
    <div style={{ height: '100%', display: 'flex' }}>
      <div style={{ height: '92%', width: '50%', padding: '2%' }}>
        <GameCreationModal createGame={props.createGame} />
        <MyGames history={props.history} />
      </div>
      <div style={{ height: '92%', width: '50%', padding: '2%' }}>
        <QuestionInputModal writeQuestion={props.writeQuestion} initialState={{ isPublic: true }} />
        <QuestionList questionItem={
            question => <Question key={question.docId} question={question} />
          }
        />
      </div>
    </div>
  </div>
  )
}

function addDispatchers(component, db, user) {
  return {
    createGame(game) {
      const { title, description, isPublic, width, height, multiplier } = game
      db.collection('gameTemplates').add({
        title,
        description,
        isPublic,
        author: {
          name: user.displayName,
          uid: user.uid
        },
      })
      .then(docRef =>
        docRef.collection('gameInfo').doc('info').set({
          width,
          height,
          multiplier,
        })
        .then(() => docRef)
      )
      .then(docRef => component.props.history.push(`games/${docRef}`))
      .catch(err => console.error('Error creating game', err))
    },
    writeQuestion(question) {
      console.log('​writeQuestion -> question', question);
      return db.collection('questions').add({
          ...question,
          author: {
            name: user.displayName,
            uid: user.uid,
          }
      })
      .catch(err => console.error('Error writing question', err))
    },
  }
}

export default firestoreConnect(null, addDispatchers)(Home)
