import React from 'react'
import { Button, List } from 'semantic-ui-react'

const ResponseQueue = props => {
  const playerResponses = Object.keys(props.responseQueue).map(uid => ({ uid, name: props.players[uid].name, time: props.responseQueue[uid] })).sort((a, b) => a.time - b.time)
  return (
    <React.Fragment>
    responses go here
    <List>
      {playerResponses.map(playerResponse => (
        <List.Item key={playerResponse.uid}>
          {/* <List.Icon name='users' /> */}
          <List.Content>
            {playerResponse.name}
            <Button
              compact
              content="correct"
              onClick={() => props.markAsAnswered(playerResponse, props.currentQuestion)}
            />
          </List.Content>
        </List.Item>
      ))}
    </List>
    </React.Fragment>
  )
}

export default ResponseQueue
