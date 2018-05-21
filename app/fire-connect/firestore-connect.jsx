import React from 'react'

import { contextConnector } from './provider'

class FirestoreConnect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.dispatchers = typeof this.props.dispatchers === 'function' ?
      this.props.dispatchers(this, this.props.firestore, this.props.user) : {}
  }

  componentDidMount() {
    this.unsubscribe = this.props.listener && this.props.listener(this, this.props.firestore, this.props.user)
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  render() {
    return (
        <React.Fragment>
          {this.props.render({ ...this.dispatchers, ...this.props, ...this.state })}
        </React.Fragment>
    )
  }
}

export default contextConnector(FirestoreConnect)


// inspired by https://github.com/reactjs/react-redux and https://github.com/FullstackAcademy/firebones

// import React from 'react'

// export default (db, auth) => (listener, dispatchers) => Component => class fireConnect extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {}
//     this.dispatchers = typeof dispatchers === 'function' ? dispatchers(this, db, auth) : {}
//   }

//   componentDidMount() {
//     if (auth && listener) {
//       this.unsubscribeAuth = auth.onIdTokenChanged(user =>
//         this.setState({ user }, () => {
//           if (!this.unsubscribeDb) this.unsubscribeDb = listener(this, db)
//         })
//       )
//     } else if (auth) {
//       this.unsubscribeAuth = auth.onIdTokenChanged(user => this.setState({ user }))
//     } else if (listener) {
//       this.unsubscribeDb = listener(this, db, auth)
//     }
//     // this.unsubscribeAuth = auth && auth.onIdTokenChanged(user => this.setState({ user }))
//     // this.unsubscribeDb = listener && listener(this, db, auth)
//   }

//   componentWillUnmount() {
//     this.unsubscribeAuth && this.unsubscribeAuth()
//     this.unsubscribeDb && this.unsubscribeDb()
//   }

//   render() {
//     return (
//       <Component
//         // should connected component have access to db and auth?
//         // db={db}
//         // auth={auth}
//         {...this.dispatchers}
//         {...this.props}
//         {...this.state}
//       />
//     )
//   }
// }
