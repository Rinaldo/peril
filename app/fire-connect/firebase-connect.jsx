import React from 'react'

import { contextConnector } from './provider'

class FirebaseConnect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.dispatchers = typeof this.props.dispatchers === 'function' ?
      this.props.dispatchers(this, this.props.firebase.ref.bind(this.props.firebase), this.props.user) : {}
  }

  componentDidMount() {
    const spyRef = path => {
      this.ref = this.props.firebase.ref(path)
      return this.ref
    }
    const getEventType = type => {
      this.eventType = type
      return type
    }
    this.callback = this.props.listener && this.props.listener(this, spyRef, this.props.user, getEventType)
  }

  componentWillUnmount() {
    if (this.ref && this.eventType) this.ref.off(this.eventType, this.callback)
    else if (this.ref) this.ref.off()
  }

  render() {
    return (
        <React.Fragment>
          {this.props._render({ ...this.dispatchers, ...this.props, ...this.state })}
        </React.Fragment>
    )
  }
}

export default contextConnector(FirebaseConnect)
