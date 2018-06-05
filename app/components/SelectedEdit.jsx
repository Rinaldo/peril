import React from 'react'
import { Item, Segment } from 'semantic-ui-react'

import Question from './Question'


const SelectedEdit = ({ question, valid, children }) => {
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
