import { prefixLimiter, createQuestionAutoTags, createGameAutoTags, parseUserTags, mergeTagSets } from './utils'

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

export const createbatchWriteTags = (connector, db) =>
  (tagSet, collectionName) => {
    const batch = db.batch()
    const collection = db.collection(collectionName)
    Object.keys(tagSet).forEach(tag => {
      batch.set(collection.doc(tag), { tag })
    })
    return batch.commit()
  }

export const createNewQuestionDispatcher = (connector, db, user) =>
  question => {
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
    return db.collection('questions').add(questionObj)
    .then(docRef => {
      createbatchWriteTags(connector, db)(allTags, 'tagsInQuestions')
      return docRef
    })
    .catch(err => console.error('Error writing question', err))
  }

export const createNewGameDispatcher = (connector, db, user) =>
  game => {
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
    return db.collection('gameTemplates').add(gameTemplateObj)
    .then(docRef => {
      docRef.collection('gameInfo').doc('info').set({
        width,
        height,
        multiplier,
      })
      return docRef
    })
    .then(docRef => connector.props.history.push(`games/${docRef.id}`))
    .then(() => createbatchWriteTags(connector, db)(autoTags, 'tagsInGames'))
    .catch(err => console.error('Error creating game', err))
  }
