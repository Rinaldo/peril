import React from 'react'

import { contextConnector } from './provider'

class FirebaseConnect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.setRef = this.setRef.bind(this)
    this.dispatchers = typeof this.props.dispatchers === 'function' ?
      this.props.dispatchers(this, this.props.firebase.ref, this.props.user) : {}
  }

  setRef(path) {
    this.ref = this.props.firebase.ref(path)
    return this.ref
  }

  componentDidMount() {
    this.props.listener && this.props.listener(this, this.setRef, this.props.user)
  }

  componentWillUnmount() {
    this.ref && this.ref.off()
  }

  render() {
    return (
        <React.Fragment>
          {this.props.render({ ...this.dispatchers, ...this.props, ...this.state })}
        </React.Fragment>
    )
  }
}

export default contextConnector(FirebaseConnect)
