import React from 'react'
import { Segment, Header, Button } from 'semantic-ui-react'


const SubHeader = props => {
  return (
    <Segment attached clearing>
      {`Players can join at ${window.location.host}/play/${props.user.uid}`}
      <Button floated="right" onClick={props.startGame}>Start Game</Button>
    </Segment>
  )
}

export default SubHeader
