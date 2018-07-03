import React from 'react'
import { firestoreConnect } from 'fire-connect'

import MyGames from './MyGames'
import QuestionList from './QuestionList'
import Question from './Question'
import GameCreationModal from './GameCreationModal'
import QuestionInputModal from './QuestionInputModal'

import { stringsToWordSet } from '../utils'

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

function addDispatchers(connector, db, user) {
  return {
    createGame(game) {
      const { title, description, isPublic, width, height, multiplier } = game
      const wordSet = stringsToWordSet(title, description)
      db.collection('gameTemplates').add({
        title,
        description,
        isPublic,
        author: {
          name: user.displayName,
          uid: user.uid
        },
        autoTags: wordSet,
        createdAt: connector.props.firestoreFieldValue.serverTimestamp(),
      })
      .then(docRef => {
        docRef.collection('gameInfo').doc('info').set({
          width,
          height,
          multiplier,
        })
        return docRef
      })
      .then(docRef => connector.props.history.push(`games/${docRef.id}`))
      .then(() =>
        db.runTransaction(transaction => {
          const refs = Object.keys(wordSet).map(word => db.collection('wordsInGames').doc(word))
          return Promise.all(refs.map(async ref => {
            const doc = await transaction.get(ref)
            if (!doc.exists) {
              transaction.set(ref, { count: 1 })
            } else {
              const newCount = doc.data().count + 1
              transaction.update(ref, { count: newCount })
            }
          }))
        })
      )
      .catch(err => console.error('Error creating game', err))
    },
    writeQuestion(question) {
      console.log('​writeQuestion -> question', question);
      const wordSet = stringsToWordSet(question.prompt, question.response)
      db.collection('questions').add({
          ...question,
          author: {
            name: user.displayName,
            uid: user.uid,
          },
          autoTags: wordSet,
          createdAt: connector.props.firestoreFieldValue.serverTimestamp(),
      })
      .then(() =>
        db.runTransaction(transaction => {
          const refs = Object.keys(wordSet).map(word => db.collection('wordsInQuestions').doc(word))
          return Promise.all(refs.map(async ref => {
            const doc = await transaction.get(ref)
            if (!doc.exists) {
              transaction.set(ref, { count: 1 })
            } else {
              const newCount = doc.data().count + 1
              transaction.update(ref, { count: newCount })
            }
          }))
        })
      )
      .catch(err => console.error('Error writing question', err))
    },
  }
}

export default firestoreConnect(null, addDispatchers)(Home)
