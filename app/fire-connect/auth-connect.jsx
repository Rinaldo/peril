import React from 'react'

import { authContextConnector } from './provider'

class AuthConnect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.authDispatchers = typeof this.props.authDispatchers === 'function'
      ? this.props.authDispatchers(this, this.props.auth, this.props.user)
      : {}
    this.unsubscribers = []
  }
  render() {
    return (
        <>
          {this.props.__render({ ...this.authDispatchers, ...this.props, ...this.state })}
        </>
    )
  }
}

export default authContextConnector(AuthConnect)
