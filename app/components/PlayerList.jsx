import React from 'react'
import { Button, List } from 'semantic-ui-react'

const PlayerList = props => {
  const players = Object.entries(props.players).map(tuple => ({ uid: tuple[0], ...tuple[1] }))
  return (
    <React.Fragment>
    players go here
    <List>
      {players.map(player => (
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
    </React.Fragment>
  )
}

export default PlayerList
