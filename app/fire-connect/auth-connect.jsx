import React from 'react'

import { contextConnector } from './provider'

class AuthConnect extends React.Component {
  render() {
    return (
        <React.Fragment>
          {this.props.render({ ...this.dispatchers, ...this.props, ...this.state })}
        </React.Fragment>
    )
  }
}

export default contextConnector(AuthConnect)
