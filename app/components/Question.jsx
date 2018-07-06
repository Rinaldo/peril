import React from 'react'
import { Item, Label } from 'semantic-ui-react'

const Question = ({ question, children }) => {
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
          By {question.author && question.author.name}
          {children}
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default Question
