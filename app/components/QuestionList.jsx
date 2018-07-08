import React from 'react'
import { firestoreConnect } from 'fire-connect'
import { createSearchableItemListeners, createSearchableItemDispatchers } from '../fireConnectCommon'

import SearchableItemList from './SearchableItemList'
import Question from './Question'

const options = {
  collectionName: 'questions',
  orderTopBy: 'gameCount',
  itemType: 'Questions',
  subTypes: ['myQuestions', 'topQuestions'],
  options: [],
  emptyListMessage: 'No Questions found. Click the button above to create one',
  renderItem: question => <Question key={question.docId} question={question} /> // eslint-disable-line react/display-name
}
const addListeners = createSearchableItemListeners(options)
const addDispatchers = createSearchableItemDispatchers(options)

export default firestoreConnect(addListeners, addDispatchers)(SearchableItemList)
