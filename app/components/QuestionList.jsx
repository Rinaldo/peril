import { firestoreConnect } from 'fire-connect'
import { createSearchableItemListeners, createSearchableItemDispatchers } from '../fireConnectCommon'

import SearchableItemList from './SearchableItemList'

const options = {
  collectionName: 'questions',
  orderTopBy: 'gameCount',
  itemType: 'Questions',
  subTypes: ['myQuestions', 'topQuestions'],
  options: [],
}
const addListeners = createSearchableItemListeners(options)
const addDispatchers = createSearchableItemDispatchers(options)

export default firestoreConnect(addListeners, addDispatchers)(SearchableItemList)
