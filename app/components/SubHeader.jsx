import React from 'react'
import { Segment, Header, Button } from 'semantic-ui-react'


const SubHeader = props => {
  return props.game ? (
    <Segment attached clearing>
      <Header>{props.game.title}</Header>
      {props.game.description}
      <Button floated="right" onClick={props.createGameInstance}>Host Game</Button>
    </Segment>
  ) : null
}

export default SubHeader

{/* < Message attached >
  <Message.Header>{props.game.title}</Message.Header>
  <Message.Content>
    {props.game.description}
    <Button floated="right" onClick={props.createGameInstance}>Host Game</Button>
    <Button floated="right">Test Button</Button>
  </Message.Content>
</Message > */}
