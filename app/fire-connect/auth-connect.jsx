import React from 'react'

import { contextConnector } from './provider'

class AuthConnect extends React.Component {
  render() {
    return (
        <>
          {this.props.__render({ ...this.dispatchers, ...this.props, ...this.state })}
        </>
    )
  }
}

export default contextConnector(AuthConnect)
