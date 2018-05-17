import React from 'react'
import { findDOMNode } from 'react-dom'
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

const DraggableQuestion = props => {
  const { connectDragSource } = props
  return (
    /* eslint-disable react/no-find-dom-node */
    <Ref innerRef={instance => connectDragSource(findDOMNode(instance))}>
      <Question question={props.question} />
    </Ref>
  )
}


export default DragSource(ItemTypes.QUESTION_FROM_LIST, questionSource, collect)(DraggableQuestion)
