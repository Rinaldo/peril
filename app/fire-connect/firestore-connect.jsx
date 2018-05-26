import React from 'react'

import { contextConnector } from './provider'

class FirestoreConnect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.dispatchers = typeof this.props.dispatchers === 'function' ?
      this.props.dispatchers(this, this.props.firestore, this.props.user) : {}
    this.unsubscribers = []
  }

  componentDidMount() {
    if (this.props.listeners) {
      const listenerResult = this.props.listeners(this, this.props.firestore, this.props.user)
      if (typeof listenerResult === 'function') {
        this.unsubscribers = [listenerResult]
      } else if (listenerResult && typeof listenerResult === 'object') {
        Object.values(listenerResult).forEach(listener => {
          this.unsubscribers.push(listener())
        })
      } else {
        throw new TypeError('return value of addListeners must be either a function (for one listener) or object (for multiple listeners)')
      }
    }
  }

  componentWillUnmount() {
    this.unsubscribers.forEach(unsubscribe => {
      unsubscribe()
    })
  }

  render() {
    return (
        <React.Fragment>
          {this.props.__render({ ...this.dispatchers, ...this.props, ...this.state })}
        </React.Fragment>
    )
  }
}

export default contextConnector(FirestoreConnect)
