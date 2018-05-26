import React from 'react'
import { Segment, Header, Button } from 'semantic-ui-react'
import { firebaseConnect } from '../fire-connect'


const SubHeader = props => {
  return (
    <Segment attached clearing>
      <p>{props.title}</p>
      <p>{props.description}</p>
      <p>Players can join at <a href={`${window.location.host}/play/${props.user.uid}`}>{`${window.location.host}/play/${props.user.uid}`}</a></p>
      <Button floated="right" onClick={props.startGame}>Start Game</Button>
    </Segment>
  )
}

const addListeners = (connector, ref, user) => ({
  title: () => ref(`games/${user.uid}/client/title`).on('value', snapshot => {
    connector.setState({ title: snapshot.val() })
  }),
  description: () => ref(`games/${user.uid}/client/description`).on('value', snapshot => {
    connector.setState({ description: snapshot.val() })
  }),
})

const addDispatchers = (connector, ref, user) => ({
  startGame() {
    ref(`games/${user.uid}/client/started`).set(true)
      .catch(err => console.log('Error:', err))
  },
})

export default firebaseConnect(addListeners, addDispatchers)(SubHeader)
