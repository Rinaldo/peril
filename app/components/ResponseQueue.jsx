import React from 'react'
import { Button, List } from 'semantic-ui-react'

const ResponseQueue = props => {
  return (
    <>
    responses go here
    <List>
      {props.responses.map(response => (
        <List.Item key={response.uid}>
          {/* <List.Icon name='users' /> */}
          <List.Content>
            {response.name}
            <Button
              compact
              content="correct"
              onClick={() => props.markAsCorrect(response)}
            />
            <Button
              compact
              content="incorrect"
              onClick={() => props.markAsIncorrect(response)}
            />
          </List.Content>
        </List.Item>
      ))}
    </List>
    </>
  )
}

export default ResponseQueue
