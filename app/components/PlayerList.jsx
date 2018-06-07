import React from 'react'
import { Button, List } from 'semantic-ui-react'

const PlayerList = props => {
  return (
    <>
    players go here
    <List>
      {props.players.map(player => (
        <List.Item key={player.uid}>
          {/* <List.Icon name='users' /> */}
          <List.Content>
            <Button
              compact
              content="X"
              onClick={() => props.removePlayer(player)}
            />
            {player.name} - {player.score}
          </List.Content>
        </List.Item>
      ))}
    </List>
    </>
  )
}

export default PlayerList
