import React from 'react'
import { Item, Segment } from 'semantic-ui-react'

import Question from './Question'
import WriteAndAddQuestion from './WriteAndAddQuestion'


const SelectedEdit = ({ question, coords, valid, locked, writeQuestion, addQuestionToGame, children }) => {
  return (
    <Segment attached>
    {
      // hovering over or selected an existing question
      (question) ?
        <Item.Group>
          <Question question={question}>
            {children}
          </Question>
        </Item.Group> :

      // selected an empty cell
      (valid && locked) ?
        <WriteAndAddQuestion
          writeQuestion={writeQuestion}
          addQuestionToGame={addQuestionToGame}
          coords={coords}
        /> :

      // hovering over an empty cell
      (valid) ?
        'Click to create a question' :

      // mouse not over board
      'Hover over the board to view questions. Click a question select it.'
    }
    </Segment>
  )
}

export default SelectedEdit
