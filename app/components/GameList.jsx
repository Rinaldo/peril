import React from 'react'
import { firestoreConnect } from 'fire-connect'
import { createSearchableItemDispatchers, createSearchableItemListeners } from '../fireConnectCommon'

import SearchableItemList from './SearchableItemList'
import GameListItem from './GameListItem'

const options = {
  collectionName: 'gameTemplates',
  orderTopBy: 'playCount',
  itemType: 'Games',
  subTypes: ['myGames', 'topGames'],
  options: [],
  emptyListMessage: 'No Games found. Click the button above to create one',
  renderItem: game => <GameListItem key={game.docId} game={game} /> // eslint-disable-line react/display-name
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
