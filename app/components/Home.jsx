import React from 'react'
import { firestoreConnect } from 'fire-connect'

import MyGames from './MyGames'
import QuestionList from './QuestionList'
import Question from './Question'
import GameCreationModal from './GameCreationModal'
import QuestionInputModal from './QuestionInputModal'

import { createQuestionAutoTags, createGameAutoTags, parseUserTags, mergeTagSets } from '../utils'

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

  const runTagsTransaction = (tagSet, collectionName) =>
    db.runTransaction(transaction => {
      const refs = Object.keys(tagSet).map(word => db.collection(collectionName).doc(word))
      return Promise.all(refs.map(async ref => {
        const doc = await transaction.get(ref)
        if (!doc.exists) {
          transaction.set(ref, { tag: ref.id, count: 1 })
        } else {
          const newCount = doc.data().count + 1
          transaction.update(ref, { count: newCount })
        }
      }))
    })

  return {
    createGame(game) {
      const { title, description, isPublic, width, height, multiplier } = game
      const autoTags = createGameAutoTags(title, description)
      db.collection('gameTemplates').add({
        title,
        description,
        isPublic,
        author: {
          name: user.displayName,
          uid: user.uid
        },
        allTags: autoTags,
        playCount: 0,
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
      .then(() => runTagsTransaction(autoTags, 'tagsInGames'))
      .catch(err => console.error('Error creating game', err))
    },
    writeQuestion(question) {
      console.log('​writeQuestion -> question', question);
      const { prompt, response, tags, isPublic } = question
      const autoTags = createQuestionAutoTags(prompt, response)
      const userTags = tags ? parseUserTags(tags) : null
      const allTags = userTags ? mergeTagSets(autoTags, userTags) : autoTags
      const questionObj = {
        prompt,
        response,
        isPublic,
        author: {
          name: user.displayName,
          uid: user.uid,
        },
        allTags,
        userTags,
        gameCount: 0,
        createdAt: connector.props.firestoreFieldValue.serverTimestamp(),
      }
      db.collection('questions').add(questionObj)
      .then(() => runTagsTransaction(allTags, 'tagsInQuestions'))
      .catch(err => console.error('Error writing question', err))
    },
  }
}

export default firestoreConnect(null, addDispatchers)(Home)
