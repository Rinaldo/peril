import React from 'react'
import { Segment, Header, Button, Loader } from 'semantic-ui-react'
import { firestoreConnect } from 'fire-connect'
import { stripData, stripTags } from '../utils'


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

const addListener = (connector, db) => (
  db
  .collection('gameTemplates')
  .doc(connector.props.gameId)
  .onSnapshot(doc => {
    if (doc.exists) {
      connector.setState({ game: { ...doc.data(), docId: doc.id}, isLoaded: true })
    } else {
      console.error('Error: document does not exist')
    }
  })
)

const addDispatchers = (connector, db, user) => ({
  createGameInstance() {
    db
    .collection('gameTemplates')
    .doc(connector.props.gameId)
    .collection('gameInfo')
    .doc('info')
    .get()
    .then(doc => doc.data())
    .then(gameInfo => {
      connector.props.database.ref(`games/${user.uid}`).set({
        client: { ...connector.state.game, gameInfo: stripData(gameInfo) },
        host: { gameInfo: stripTags(gameInfo) },
      })
      connector.props.history.push('/host')
    })
    .catch(err => console.error('Error:', err))
  }
})

export default firestoreConnect(addListener, addDispatchers)(SubHeader)
