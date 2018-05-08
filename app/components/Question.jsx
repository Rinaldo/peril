import React from 'react'
import { findDOMNode } from 'react-dom';
import { Item, Label, Ref } from 'semantic-ui-react'
import { DragSource } from 'react-dnd'
import { ItemTypes } from '../utils'

const questionSource = {
  beginDrag(props) {
    return props.question
  }
}

function collect(connect) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

const Question = ({ question }) => {
  return (
    <Item>
        <Item.Content verticalAlign="middle">
          <div style={{ display: 'flex', marginBottom: '0.5em' }}>
            <p style={{ fontWeight: 'bold', minWidth: '4.6em', textAlign: 'right' }}>Prompt:</p>
            <p style={{ paddingLeft: '0.4em' }}>{question.prompt}</p>
          </div>
          <div style={{ display: 'flex' }}>
            <p style={{ fontWeight: 'bold', minWidth: '4.5em', textAlign: 'right' }}>Response:</p>
            <p style={{ paddingLeft: '0.4em' }}>{question.response}</p>
          </div>
          <Item.Extra>
            {question.tags && Object.keys(question.tags).map(tag => (
              <Label key={tag}>{tag}</Label>
            ))}
          </Item.Extra>
          <Item.Extra>By {question.author && question.author.username}</Item.Extra>
        </Item.Content>
      </Item>
  )
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
