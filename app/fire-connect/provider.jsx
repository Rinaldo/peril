/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react'

const fireContext = React.createContext()

export default class Provider extends Component {
  constructor(props) {
    super(props)
    // putting props in state to pass to context
    this.state = {
      auth: this.props.auth,
      firebase: this.props.firebase,
      firestore: this.props.firestore,
      firebaseTimestamp: this.props.firebaseTimestamp,
      firestoreTimestamp: this.props.firestoreTimestamp,
    }
    // Provider takes a boolean prop that changes the auth listener
    this.onChange = this.props.onIdTokenChanged ? 'onIdTokenChanged' : 'onAuthStateChanged'
  }
  // Provider's props shouldn't change, but this and componentDidUpdate are here just in case
  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {}
    Object.keys(prevState).forEach(key => {
      if (prevState[key] !== nextProps[key]) newState[key] = nextProps[key]
    })
    return Object.keys(newState).length ? newState : null
  }

  componentDidMount() {
    this.unsubscribeAuth = this.props.auth && this.props.auth[this.onChange](user => this.setState({ user }))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.auth !== this.props.auth) {
      this.unsubscribeAuth && this.unsubscribeAuth()
      this.unsubscribeAuth = this.props.auth && this.props.auth[this.onChange](user => this.setState({ user }))
    }
  }

  componentWillUnmount() {
    this.unsubscribeAuth && this.unsubscribeAuth()
  }

  render() {
    return (
      <fireContext.Provider value={this.state}>
        {this.props.children}
      </fireContext.Provider>
    )
  }
}

/* eslint-disable react/prefer-stateless-function */
/* returning a class function so it has a display name */
export const contextConnector = Connector =>
  (listeners, dispatchers) =>
    ConnectedComponent =>
      class WithContext extends React.Component {
        render() {
          return (
            <fireContext.Consumer>
              {context => (
                <Connector
                  {...context}
                  listeners={listeners}
                  dispatchers={dispatchers}
                  {...this.props}
                  __render={stuff => <ConnectedComponent {...stuff} />}
                />
              )}
            </fireContext.Consumer>
          )
        }
}
