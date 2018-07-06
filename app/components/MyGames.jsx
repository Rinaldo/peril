import React from 'react'
import { Link } from 'react-router-dom'
import { Item, Menu, Segment, Input, Loader } from 'semantic-ui-react'
import { firestoreConnect } from 'fire-connect'


const MyGames = props => {
  return (
    <div style={{ height: '100%' }}>
      <Menu attached widths={2}>
        <Menu.Item name="My Games" active />
        <Menu.Item name="Top Games" style={{ color: 'rgb(212, 212, 212)' }} />
      </Menu>
      <Segment attached style={{ height: '40px', paddingTop: '10px' }}>
        <Input
          disabled
          transparent
          icon={{ name: 'search', link: true }}
          style={{ display: 'block' }}
          placeholder="Search Games..."
        />
      </Segment>
      <Segment attached style={{ overflowY: 'auto', height: 'calc(100% - 80px)' }}>
        {props.isLoaded ?
        <Item.Group divided>
          {props.games.map(game => (
            <Item key={game.docId}>
              <Item.Content>
                <Item.Header as={Link} to={`games/${game.docId}`}>{game.title}</Item.Header>
                <Item.Meta>by {game.author && game.author.name}</Item.Meta>
                <Item.Description>{game.description}</Item.Description>
              </Item.Content>
            </Item>
          ))}
        </Item.Group>
        : <Loader active />}
      </Segment>
    </div>
  )
}

function addListener(component, db, user) {
  return db.collection('gameTemplates').where('author.uid', '==', user.uid)
    .onSnapshot(querySnapshot => {
      const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
      component.setState({ games: docsData, isLoaded: true })
    })
}

export default firestoreConnect(addListener)(MyGames)
