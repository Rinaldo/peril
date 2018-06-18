/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react'

const fireContext = React.createContext()

export default class Provider extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    // Provider takes a boolean prop that changes the auth listener
    this.onChange = this.props.onIdTokenChanged ? 'onIdTokenChanged' : 'onAuthStateChanged'
  }

  componentDidMount() {
    this.unsubscribeAuth = this.props.auth && this.props.auth[this.onChange](user => this.setState({ user }))
  }
  // auth shouldn't change, but just in case it does...
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
      <fireContext.Provider value={{ ...this.props, ...this.state }}>
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
