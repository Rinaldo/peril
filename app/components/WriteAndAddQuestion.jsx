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
    .then(doc => doc.get())
    .then(createdQuestion => this.props.addQuestionToGame(createdQuestion, ...this.props.coords))
  }

  render() {
    return (
      <QuestionInput submit={this.submit} initialState={this.state} />
    )
  }
}

export default WriteAndAddQuestion
