import { prefixLimiter } from './utils'

export const createSearchableItemListeners = ({ itemType, collectionName, orderTopBy }) =>
  (connector, db, user) => ({
    myItems: () => db.collection(collectionName).where('author.uid', '==', user.uid).orderBy('createdAt', 'desc')
    .onSnapshot(querySnapshot => {
        const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
        connector.setState({ ['my' + itemType]: docsData, ['my' + itemType + 'Loaded']: true })
    }),
    topItems: () => db.collection(collectionName).where('isPublic', '==', true).orderBy(orderTopBy, 'desc').limit(25)
    .onSnapshot(querySnapshot => {
        const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
        connector.setState({ ['top' + itemType]: docsData, ['top' + itemType + 'Loaded']: true })
    })
  })

export const createSearchableItemDispatchers = itemTypeOptions =>
  (connector, db) => {
    connector.optionsHelper = {}
    connector.state = itemTypeOptions
    return {
      getSearchSuggestions(prefix) {
        prefix = prefix.toLowerCase()
        db.collection(`tagsIn${itemTypeOptions.itemType}`)
        .orderBy('tag')
        .startAt(prefix)
        .endBefore(prefixLimiter(prefix))
        .get()
        .then(queryResult => {
          queryResult.forEach(doc => {
            connector.optionsHelper[doc.data().tag] = true
          })
          const options = Object.keys(connector.optionsHelper).sort().map(tag => ({ key: tag, value: tag, text: tag }))
          connector.setState({ options, suggestionsLoaded: true })
        })
      },
      resetSuggestionsLoaded() {
        connector.setState({ suggestionsLoaded: false })
      },
      searchDbForItems(tags) {
        if (tags.length) {
          console.log('​searchDbForItems -> itemTypeOptions.collectionName', itemTypeOptions.collectionName);
          const query = tags.reduce((prev, curr) => prev.where(`allTags.${curr}`, '==', true), db.collection(itemTypeOptions.collectionName).where('isPublic', '==', true))
          query.get()
          .then(queryResult => {
            const searchResults = queryResult.docs.map(doc => ({ docId: doc.id, ...doc.data() }))
            connector.setState({ searchResults, searchResultsLoaded: true })
          })
        }
      }
    }
  }
