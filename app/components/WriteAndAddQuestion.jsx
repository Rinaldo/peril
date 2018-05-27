import React, { Component } from 'react'

import QuestionInput from './QuestionInput'

class WriteAndAddQuestion extends Component {
  constructor(props) {
    super(props)
    this.state = { isPublic: true }
    this.submit = this.submit.bind(this)
  }

  submit(question) {
    this.props.writeQuestion(question)
    .then(docRef => docRef.get())
    .then(doc => doc.data())
    .then(createdQuestion => this.props.addQuestionToGame(createdQuestion, ...this.props.coords))
    .catch(err => console.error('Error adding question', err))
  }

  render() {
    return (
      <QuestionInput submit={this.submit} initialState={this.state} />
    )
  }
}

export default WriteAndAddQuestion
