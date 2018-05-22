import React from 'react'
import { Ref } from 'semantic-ui-react'
import { DragSource } from 'react-dnd'
import { ItemTypes } from '../utils'

import Question from './Question'

const questionSource = {
  beginDrag(props) {
    return {
      draggedQuestion: props.question
    }
  }
}

function collect(connect) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

const DraggableQuestion = ({ connectDragSource, question }) => {
  return (
    <Ref innerRef={instance => connectDragSource(instance)}>
      <Question question={question} />
    </Ref>
  )
}


export default DragSource(ItemTypes.QUESTION_FROM_LIST, questionSource, collect)(DraggableQuestion)
