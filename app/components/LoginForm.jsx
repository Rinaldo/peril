// import React, { Component } from 'react'
// import { Form } from 'semantic-ui-react'

// import { db, auth } from '../firebase'


// class LoginForm extends Component {

//   constructor(props) {
//     super(props)
//     this.handleChange = this.handleChange.bind(this)
//     this.login = this.login.bind(this)
//     this.state = {
//       displayName: '',
//       email: '',
//       password: '',
//     }
//   }

//   componentDidMount() {
//     auth.onAuthStateChanged((user) => {
//       console.log('auth state change in form')
//       if (user) {
//         this.setState({ user })
//       }
//     })
//   }

//   login() {
//     console.log('logging in...')
//     // returns just the user object
//     auth.signInWithEmailAndPassword(this.state.email, this.state.password)
//       .then(user => {
//         this.setState({ user })
//         console.log('returned user in loginForm:', user)
//         const userRef = db.collection('users').doc(user.uid)
//         userRef.set({
//           displayName: this.state.displayName,
//         }, { merge: true })
//         .then(() => {
//           return userRef.collection('privateInfo').doc(user.uid).set({
//             email: user.email,
//             emailVerified: false,
//             isAnonymous: false,
//           }, { merge: true })
//         })
//         .then(() => console.log('document created successfully!'))
//         .catch(error => console.log('error:', error))
//       })
//       .catch(error => console.log('error:', error))
//     }

//   handleChange(_, { name, value, checked }) {
//     this.setState({ [name]: value !== undefined ? value : checked })
//   }

//   render() {
//     return (
//       <Form>
//         <Form.Input
//           name="displayName"
//           label="Name"
//           placeholder="John Doe"
//           value={this.state.displayName}
//           onChange={this.handleChange} />
//         <Form.Input
//           name="email"
//           label="Email"
//           placeholder="email@example.com"
//           value={this.state.email}
//           onChange={this.handleChange} />
//         <Form.Input
//           name="password"
//           label="Password"
//           value={this.state.password}
//           onChange={this.handleChange} />
//         <Form.Button
//           content="Submit"
//           disabled={!(this.state.displayName && this.state.email && this.state.password)}
//           onClick={this.login} />
//       </Form>
//     )
//   }
// }

// export default LoginForm
