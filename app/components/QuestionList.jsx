import React, { Component } from 'react'
import { Item, Menu, Segment, Dropdown, Loader } from 'semantic-ui-react'
import { firestoreConnect } from 'fire-connect'

import { prefixLimiter } from '../utils'


class Questions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchQuery: '',
      value: [],
      display: 'My Questions',
      lastDisplay: 'My Questions',
    }
    this.setDisplay = this.setDisplay.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.dropdownSearch = this.dropdownSearch.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleLabelClick = this.handleLabelClick.bind(this)
  }
  handleLabelClick(evt, data) {
  console.log('​Questions -> handleLabelClick -> data', data);

  }
  handleKeyDown(event) {
    event.stopPropagation()
    if (event.key === 'Backspace') {
      console.log('​Questions -> handleKeyDown -> event.key', event.key);
      this.setState(prevState => {
        if (prevState.value.length && !prevState.searchQuery.length) {
          const slicedValue = prevState.value.slice(0, -1)
          this.props.searchQuestions(slicedValue)
          return {
            value: slicedValue,
            searchQuery: prevState.value[prevState.value.length - 1]
          }
        } else {
          return null
        }
      })
    }
  }
  dropdownSearch(options, query) {
    return options.filter(option => option.text.startsWith(query))
  }
  setDisplay(_, { name }) {
    this.setState(prevState =>
      (prevState.display === 'Search'
        ? { display: name, lastDisplay: prevState.display, value: [] }
        : { display: name, lastDisplay: prevState.display })
      )
  }
  handleChange(e, { searchQuery, value }) { // eslint-disable-line no-unused-vars
    console.log('​handleChange -> value', value);
    this.props.searchQuestions(value)
    this.setState(prevState => {
      const changes = { searchQuery: '', value }
      if (value.length && prevState.display !== 'Search') {
        changes.display = 'Search'
        changes.lastDisplay = prevState.display
      }
      else if (!value.length && prevState.display === 'Search') {
        changes.display = prevState.lastDisplay
        changes.lastDisplay = 'Search'
      }
      return changes
    })
  }
  handleSearchChange(e, { searchQuery }) {
    if (searchQuery.length < 2 && this.props.suggestionsLoaded) {
      this.props.resetSuggestionsLoaded()
    }
    this.setState(prevState => {
      if (prevState.searchQuery.length < 2 && searchQuery.length === 2) {
        this.props.getSearchSuggestions(searchQuery)
      }
      return { searchQuery }
    })
  }
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Menu attached widths={2}>
          <Menu.Item
            active={this.state.display === 'My Questions'}
            name="My Questions"
            onClick={this.setDisplay}
          />
          <Menu.Item
            active={this.state.display === 'Top Questions'}
            name="Top Questions"
            onClick={this.setDisplay}
          />
        </Menu>
        <Segment attached style={{ padding: 0 }}>
          <Dropdown
            onKeyDown={this.handleKeyDown}
            onLabelClick={this.handleLabelClick}
            style={{ border: 'none' }}
            deburr
            fluid
            multiple
            selection
            closeOnChange
            minCharacters={2}
            placeholder="Search Questions..."
            noResultsMessage={this.props.suggestionsLoaded ? 'No results found' : 'Loading...'}
            options={this.props.options}
            onChange={this.handleChange}
            search={this.dropdownSearch}
            onSearchChange={this.handleSearchChange}
            searchQuery={this.state.searchQuery}
            value={this.state.value}
          />
        </Segment>
        <Segment attached style={{ overflowY: 'auto', height: 'calc(100% - 80px)' }}>
          {
            (this.state.display === 'My Questions' && this.props.myQuestionsLoaded) ?
            <Item.Group divided>
              {this.props.myQuestions.map(question => this.props.questionItem(question))}
            </Item.Group>
            :
            (this.state.display === 'Top Questions' && this.props.topQuestionsLoaded) ?
            <Item.Group divided>
              {this.props.topQuestions.map(question => this.props.questionItem(question))}
            </Item.Group>
            :
            (this.state.display === 'Search' && this.props.searchResultsLoaded) ?
            <Item.Group divided>
              {this.props.searchResults.map(question => this.props.questionItem(question))}
            </Item.Group>
            :
            <Loader active />
          }
        </Segment>
      </div>
    )
  }
}

const addListener = (component, db, user) => ({
  myQuestions: () => db.collection('questions').where('author.uid', '==', user.uid).orderBy('createdAt', 'desc')
  .onSnapshot(querySnapshot => {
      const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
      component.setState({ myQuestions: docsData, myQuestionsLoaded: true })
  }),
  topQuestions: () => db.collection('questions').where('isPublic', '==', true).orderBy('gameCount', 'desc').limit(25)
  .onSnapshot(querySnapshot => {
      const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
      component.setState({ topQuestions: docsData, topQuestionsLoaded: true })
  })
})

const addDispatchers = (connector, db) => {
  connector.optionsHelper = {}
  connector.state.options = []
  return {
    getSearchSuggestions(prefix) {
      prefix = prefix.toLowerCase()
      db.collection('tagsInQuestions')
      .where('tag', '>=', prefix).where('tag', '<', prefixLimiter(prefix))
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
    searchQuestions(tags) {
      if (tags.length) {
        const query = tags.reduce((prev, curr) => prev.where(`allTags.${curr}`, '==', true), db.collection('questions'))
        query.get()
        .then(queryResult => {
          const searchResults = queryResult.docs.map(doc => ({ docId: doc.id, ...doc.data() }))
          connector.setState({ searchResults, searchResultsLoaded: true })
        })
      }
    }
  }
}

export default firestoreConnect(addListener, addDispatchers)(Questions)
