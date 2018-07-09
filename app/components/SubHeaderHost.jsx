import React from 'react'
import { Segment, Header, Button, Checkbox } from 'semantic-ui-react'
import { firebaseConnect } from 'fire-connect'


const SubHeader = props => {
  return (
    <Segment attached clearing>
      <p>{props.title}</p>
      <p>{props.description}</p>
      <p>Players can join at <a href={`${window.location.origin}/play/${props.user.uid}`}>{`${window.location.origin}/play/${props.user.uid}`}</a></p>
      {!props.started && <Checkbox label="Allow players to join after game has started" onClick={props.allowLatePlayers} />}
      {!props.started && <Button floated="right" onClick={props.startGame}>Start Game</Button>}
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
  started: () => ref(`games/${user.uid}/client/started`).on('value', snapshot => {
    connector.setState({ started: snapshot.val() })
  }),
})

const addDispatchers = (connector, ref, user) => ({
  startGame() {
    ref(`games/${user.uid}/client/started`).set(true)
      .catch(err => console.log('Error:', err))
  },
  allowLatePlayers(_, { checked }) {
    ref(`games/${user.uid}/client/latePlayersAllowed`).set(checked)
    .catch(err => console.log('Error:', err))
  }
})

export default firebaseConnect(addListeners, addDispatchers)(SubHeader)
