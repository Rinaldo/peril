import React from 'react'
import { Segment, Header, Button, Loader } from 'semantic-ui-react'
import { firestoreConnect } from '../fire-connect'
import { stripData } from '../utils'


const SubHeader = props => {
  return (
    <div style={{ minHeight: '60px' }}>
      {props.isLoaded ?
      <Segment attached clearing>
        <Header>{props.game.title}</Header>
        {props.game.description}
        <Button floated="right" onClick={props.createGameInstance}>Host Game</Button>
      </Segment>
      : <Loader active inline="centered" />}
    </div>
  )
}

const addListener = (component, db) => (
  db
  .collection('gameTemplates')
  .doc(component.props.gameId)
  .onSnapshot(doc => {
    if (doc.exists) {
      component.setState({ game: { ...doc.data(), docId: doc.id}, isLoaded: true })
    } else {
      console.error('Error: document does not exist')
    }
  })
)

const addDispatchers = (component, db, user) => ({
  createGameInstance() {
    db
    .collection('gameTemplates')
    .doc(component.props.gameId)
    .collection('gameInfo')
    .doc('info')
    .get()
    .then(doc => doc.data())
    .then(gameInfo => {
      component.props.firebase.ref(`games/${user.uid}`).set({
        client: { ...component.state.game, gameInfo: stripData(gameInfo) },
        host: { gameInfo },
      })
      component.props.history.push('/host')
    })
    .catch(err => console.error('Error:', err))
  }
})

export default firestoreConnect(addListener, addDispatchers)(SubHeader)
