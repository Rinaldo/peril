import React from 'react'
import { Link } from 'react-router-dom'
import { Item } from 'semantic-ui-react'

const GameListItem = ({ game }) => (
  <Item>
    <Item.Content>
      <Item.Header as={Link} to={`games/${game.docId}`}>{game.title}</Item.Header>
      <Item.Meta>by {game.author && game.author.name}</Item.Meta>
      <Item.Description>{game.description}</Item.Description>
    </Item.Content>
  </Item>
)

export default GameListItem
