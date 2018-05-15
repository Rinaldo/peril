//inspired by https://github.com/reactjs/react-redux and https://github.com/FullstackAcademy/firebones

import React from 'react'

export default (db, auth) => (listener, dispatchers) => Component => class fireConnect extends React.Component {
  constructor(props) {
    super(props)
    this.dispatchers = typeof dispatchers === 'function' ? dispatchers(this, db, auth) : {}
  }

  componentDidMount() {
    // refactor to avoid waiting for auth and state change before setting up listener?
    if (auth && listener) {
      this.unsubscribeAuth = auth.onIdTokenChanged(user =>
        this.setState({ user }, () => {
          if (!this.unsubscribeDb) this.unsubscribeDb = listener(this, db)
        })
      )
    } else if (auth) {
      this.unsubscribeAuth = auth.onIdTokenChanged(user => this.setState({ user }))
    } else if (listener) {
      this.unsubscribeDb = listener(this, db, auth)
    }
    // this.unsubscribeAuth = auth && auth.onIdTokenChanged(user => this.setState({ user }))
    // this.unsubscribeDb = listener && listener(this, db, auth)
  }

  componentWillUnmount() {
    this.unsubscribeAuth && this.unsubscribeAuth()
    this.unsubscribeDb && this.unsubscribeDb()
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
