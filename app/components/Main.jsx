import React, { Component } from 'react'
import { db } from '../firebase'

class Main extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = { counter: 0 }
  }

  componentDidMount() {
    db.collection('tests').doc('test1')
    .onSnapshot(doc => {
        console.log('Current data:', doc.data())
        this.setState(doc.data())
    })
  }

  handleClick() {
    console.log('clicked!')
    db.collection('tests').doc('test1').set({ counter: this.state.counter + 1 })
    .then(() => console.log('written successfully'))
    .catch((err) => console.log('error:', err))
  }

  render() {
    return (
      <div>
        <h1>Hello World!!!!</h1>
        <h2>Counter is {this.state.counter}!</h2>
        <button onClick={this.handleClick}>increment</button>
      </div>
    )
  }
}

export default Main
