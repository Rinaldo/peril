import React from 'react'
import { Item, Label } from 'semantic-ui-react'

const Question = props => (
  <Item>
    <Item.Content verticalAlign="middle">
      <div style={{ display: 'flex', marginBottom: '0.5em' }}>
        <p style={{ fontWeight: 'bold', minWidth: '4.6em', textAlign: 'right' }}>Prompt:</p>
        <p style={{ paddingLeft: '0.4em' }}>{props.question.prompt}</p>
      </div>
      <div style={{ display: 'flex' }}>
        <p style={{ fontWeight: 'bold', minWidth: '4.5em', textAlign: 'right' }}>Response:</p>
        <p style={{ paddingLeft: '0.4em' }}>{props.question.response}</p>
      </div>
      <Item.Extra>
        {props.question.tags && Object.keys(props.question.tags).map(tag => (
          <Label key={tag}>{tag}</Label>
        ))}
      </Item.Extra>
      <Item.Extra>By Robert Rinaldo</Item.Extra>
    </Item.Content>
  </Item>
)

export default Question
