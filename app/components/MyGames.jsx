import React from 'react'
import { Link } from 'react-router-dom'
import { Item } from 'semantic-ui-react'
import { fireAuthConnect } from '../firebase'

import GameCreationModal from './GameCreationModal'

const MyGames = props => {
  return (
    <div>
      <Item.Group>
        {props.isLoaded && props.games.map(game => (
          <Item key={game.docId}>
            <Item.Content>
              <Item.Header as={Link} to={`games/${game.docId}`}>{game.title}</Item.Header>
              <Item.Meta>by {game.author && game.author.name}</Item.Meta>
              <Item.Description>{game.description}</Item.Description>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
      <GameCreationModal createGame={props.createGame} />
    </div>
  )
}

function addListener(component, db) {
  return db.collection('gameTemplates').where('author.uid', '==', component.state.user.uid)
    .onSnapshot(querySnapshot => {
      const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
      component.setState({ games: docsData, isLoaded: true })
    })
}

function addDispatchers(component, db) {
  return {
    createGame(game) {
      const { title, description, isPublic, width, height, multiplier } = game
      db.collection('gameTemplates').add({
        title,
        description,
        isPublic,
        author: {
          name: component.state.user.displayName,
          uid: component.state.user.uid
        },
      })
      .then(docRef =>
        docRef.collection('gameInfo').doc('info').set({
          width,
          height,
          multiplier,
        })
        .then(() => docRef)
      )
      .then(docRef => component.props.history.push(`games/${docRef}`))
      .catch(err => console.error('Error creating game', err))
    }
  }
}

export default fireAuthConnect(addListener, addDispatchers)(MyGames)
