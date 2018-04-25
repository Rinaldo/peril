import React, { Component } from 'react'

import Questions from './Questions'
import QuestionInput from './QuestionInput'

class Main extends Component {

  render() {
    return (
      <div>
        <Questions />
        <QuestionInput />
      </div>
    )
  }
}

export default Main
