//inspired by https://github.com/reactjs/react-redux and https://github.com/FullstackAcademy/firebones

import React from 'react'

export default (db, auth) => (listener, dispatchers) => Component => class fireConnect extends React.Component {
  constructor(props) {
    super(props)
    this.dispatchers = typeof dispatchers === 'function' ? dispatchers(this, db, auth) : {}
  }

  componentDidMount() {
    this.unsubscribeDb = listener && listener(this, db)
    this.unsubscribeAuth = auth && auth.onIdTokenChanged(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsubscribeDb && this.unsubscribeDb()
    this.unsubscribeAuth && this.unsubscribeAuth()
  }

  render() {
    return (
      <Component
        db={db}
        auth={auth}
        {...this.dispatchers}
        {...this.props}
        {...this.state}
      />
    )
  }
}
