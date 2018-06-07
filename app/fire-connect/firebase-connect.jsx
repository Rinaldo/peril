import React from 'react'

import { contextConnector } from './provider'

class FirebaseConnect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.dispatchers = typeof this.props.dispatchers === 'function' ?
      this.props.dispatchers(this, this.props.firebase.ref.bind(this.props.firebase), this.props.user) : {}
    this.spyRef = this.spyRef.bind(this)
    this.setEventType = this.setEventType.bind(this)
    this.fireRefs = []
    this.eventTypes = []
    this.callbacks = []
  }

  spyRef(path) {
    const fireRef = this.props.firebase.ref(path)
    this.fireRefs.push(fireRef)
    return fireRef
  }

  setEventType(type) {
    this.eventTypes.push(type)
    return type
  }

  componentDidMount() {
    if (this.props.listeners) {
      const listenerResult = this.props.listeners(this, this.spyRef, this.props.user, this.setEventType)
      if (typeof listenerResult === 'function') {
        this.callbacks.push(listenerResult)
        if (!this.eventTypes.length) this.eventTypes.push(null)
      } else if (listenerResult && typeof listenerResult === 'object') {
        Object.values(listenerResult).forEach((listener, index) => {
          this.callbacks.push(listener())
          if (this.eventTypes.length <= index) {
            this.eventTypes.push(null)
          }
        })
      } else {
        throw new TypeError('return value of addListeners must be either a function (for one listener) or object (for multiple listeners)')
      }
    }
  }

  componentWillUnmount() {
    this.fireRefs.forEach((ref, index) => {
      if (this.eventTypes[index]) ref.off(this.eventTypes[index], this.callbacks[index])
      else ref.off()
    })
  }

  render() {
    return (
        <>
          {this.props.__render({ ...this.dispatchers, ...this.props, ...this.state })}
        </>
    )
  }
}

export default contextConnector(FirebaseConnect)
