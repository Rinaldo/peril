import { firestoreConnect } from 'fire-connect'
import { createSearchableItemDispatchers, createSearchableItemListeners } from '../fireConnectCommon'

import SearchableItemList from './SearchableItemList'

const options = {
  collectionName: 'gameTemplates',
  orderTopBy: 'playCount',
  itemType: 'Games',
  subTypes: ['myGames', 'topGames'],
  options: []
}
// const addListeners = createSearchableItemListeners(options)
const addDispatchers = createSearchableItemDispatchers(options)

// temporarily disabling top games until I properly prevent people from editing games that aren't theirs
const addListeners = (connector, db, user) => ({
  myItems: () => db.collection('gameTemplates').where('author.uid', '==', user.uid).orderBy('createdAt', 'desc')
  .onSnapshot(querySnapshot => {
      const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
      connector.setState({ myGames: docsData, myGamesLoaded: true, topGames: [], topGamesLoaded: true })
  }),
})

export default firestoreConnect(addListeners, addDispatchers)(SearchableItemList)
