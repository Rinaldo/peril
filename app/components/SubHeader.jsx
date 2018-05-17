import React from 'react'
import { Message, Button } from 'semantic-ui-react'


const SubHeader = props => {
  return props.game ? (
    <Message attached>
      <Message.Header>{props.game.title}</Message.Header>
      <Message.Content>
        <Button onClick={props.createGameInstance}>Host Game</Button>
        <Button>Test Button</Button>
      </Message.Content>
    </Message>
  ) : null
}

export default SubHeader
