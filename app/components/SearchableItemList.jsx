import React, { Component } from 'react'
import { Item, Menu, Segment, Dropdown, Loader } from 'semantic-ui-react'

import { camelCaseToTitleCase } from '../utils'

/*
  SearchableItemList expects to be given:
  itemType: string   ex itemType: 'Questions'
  subTypes: [types]   ex subTypes: ['myQuestions', 'topQuestions']
  options: [{ key, value, text }]
  optionsLoaded: boolean
  searchResults: [items]
  searchResultsLoaded: boolean
  [subType]: [items]   ex myQuestions: [questionObjects]
  [subType + 'Loaded']: boolean
  emptyListMessage: string   ex emptyListMessage: 'No Questions Found'
*/

class SearchableItemList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchQuery: '',
      value: [],
      display: this.props.subTypes[0],
      lastDisplay: this.props.subTypes[0],
    }
    this.setDisplay = this.setDisplay.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.dropdownSearch = this.dropdownSearch.bind(this)
  }
  dropdownSearch(options, query) {
    return options.filter(option => option.text.startsWith(query))
  }
  setDisplay(_, { name }) {
    this.setState(prevState =>
      (prevState.display === 'searchResults'
        ? { display: name, lastDisplay: prevState.display, value: [] }
        : { display: name, lastDisplay: prevState.display })
      )
  }
  handleChange(e, { searchQuery, value }) { // eslint-disable-line no-unused-vars
    this.props.searchDbForItems(value)
    this.setState(prevState => {
      const changes = { searchQuery: '', value }
      if (value.length && prevState.display !== 'searchResults') {
        changes.display = 'searchResults'
        changes.lastDisplay = prevState.display
      }
      else if (!value.length && prevState.display === 'searchResults') {
        changes.display = prevState.lastDisplay
        changes.lastDisplay = 'searchResults'
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
        <Menu attached="top" widths={2}>
          {this.props.subTypes.map(subType => (
            <Menu.Item
              key={subType}
              active={this.state.display === subType}
              name={subType}
              content={camelCaseToTitleCase(subType)}
              onClick={this.setDisplay}
            />
          ))}
        </Menu>
        <Segment attached style={{ padding: 0 }}>
          <Dropdown
            style={{ border: 'none' }}
            deburr
            fluid
            multiple
            selection
            closeOnChange
            minCharacters={2}
            placeholder={`Search ${this.props.itemType}...`}
            noResultsMessage={this.props.suggestionsLoaded ? 'No results found' : 'Loading...'}
            options={this.props.options}
            onChange={this.handleChange}
            // onKeyDown={this.handleKeyDown}
            search={this.dropdownSearch}
            onSearchChange={this.handleSearchChange}
            searchQuery={this.state.searchQuery}
            value={this.state.value}
          />
        </Segment>
        <Segment attached="bottom" style={{ overflowY: 'auto', height: 'calc(100% - 80px)' }}>
          {
            this.props[this.state.display + 'Loaded']
            ?
            this.props[this.state.display].length
            ?
            <Item.Group divided>
              {this.props[this.state.display].map(item => this.props.renderItem(item))}
            </Item.Group>
            :
            this.props.emptyListMessage || `No ${this.props.itemType} found.`
            :
            <Loader active />
          }
        </Segment>
      </div>
    )
  }
}

export default SearchableItemList


// handleKeyDown(event) {
//   if (event.key === 'Backspace') {
//     this.setState(prevState => {
//       if (prevState.value.length && !prevState.searchQuery.length) {
//         const changes = {
//           value: prevState.value.slice(0, -1),
//           searchQuery: prevState.value[prevState.value.length - 1]
//         }
//         if (!changes.value.length && prevState.display === 'searchResults') {
//           changes.display = prevState.lastDisplay
//           changes.lastDisplay = 'searchResults'
//         }
//         this.props.searchQuestions(changes.value)
//         return changes
//       } else {
//         return null
//       }
//     })
//   }
// }
