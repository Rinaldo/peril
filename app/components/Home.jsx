import React from 'react'
import { firestoreConnect } from 'fire-connect'

import GameList from './GameList'
import QuestionList from './QuestionList'
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
        <GameList />
      </div>
      <div style={{ height: '92%', width: '50%', padding: '2%' }}>
        <QuestionInputModal
          writeQuestion={props.writeQuestion}
          initialState={{ isPublic: true }}
        />
        <QuestionList />
      </div>
    </div>
  </div>
  )
}

function addDispatchers(connector, db, user) {

  const batchWriteTags = (tagSet, collectionName) => {
    const batch = db.batch()
    const collection = db.collection(collectionName)
    Object.keys(tagSet).forEach(tag => {
      batch.set(collection.doc(tag), { tag })
    })
    return batch.commit()
  }

  return {
    createGame(game) {
      const { title, description, isPublic, width, height, multiplier } = game
      const autoTags = createGameAutoTags(title, description)
      const gameTemplateObj = {
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
      }
      db.collection('gameTemplates').add(gameTemplateObj)
      .then(docRef => {
        docRef.collection('gameInfo').doc('info').set({
          width,
          height,
          multiplier,
        })
        return docRef
      })
      .then(docRef => connector.props.history.push(`games/${docRef.id}`))
      .then(() => batchWriteTags(autoTags, 'tagsInGames'))
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
      .then(() => batchWriteTags(allTags, 'tagsInQuestions'))
      .catch(err => console.error('Error writing question', err))
    },
  }
}

export default firestoreConnect(null, addDispatchers)(Home)
