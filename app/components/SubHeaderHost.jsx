import React from 'react'
import { Segment, Header, Button } from 'semantic-ui-react'


const SubHeader = props => {
  return (
    <Segment attached clearing>
      {`Players can join at ${window.location.host}/play/${props.user.uid}`}
      <Button floated="right">Start Game (Placeholder)</Button>
    </Segment>
  )
}

export default SubHeader
