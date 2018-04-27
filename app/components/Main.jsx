import React, { Component } from 'react'

import Questions from './Questions'
import QuestionInput from './QuestionInput'
import Board from './Board'

class Main extends Component {

  render() {
    return (
      <div>
        {/* <Questions />
        <QuestionInput /> */}
        <Board />
      </div>
    )
  }
}

export default Main
