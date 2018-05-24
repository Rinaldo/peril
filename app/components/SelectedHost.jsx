import React from 'react'
import { Item, Segment } from 'semantic-ui-react'

import Question from './Question'


const SelectedHost = ({question, valid, children}) => {
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
          'No question in this cell' :

        // mouse not over board
        'Hover over the board to view questions. Click a question select it.'
      }
    </Segment>
  )
}

export default SelectedHost
