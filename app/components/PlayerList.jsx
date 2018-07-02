import React from 'react'
import { List } from 'semantic-ui-react'

const PlayerList = props => {
  return (
    <>
      {props.players.length ?
        <List>
          {props.players.map(player => (
            <List.Item key={player.uid}>
              <List.Icon
                name="user close"
                onClick={() => props.removePlayer(player)}
                style={{ cursor: 'pointer', fontSize: '1.2em' }}
              />
              <List.Content style={{ fontSize: '1.2em' }}>
                <strong style={{ marginRight: '0.6em' }}>{player.name}</strong><span>{player.score} pts</span>
              </List.Content>
            </List.Item>
          ))}
        </List>
        :
        'No players yet'
      }
    </>
  )
}

export default PlayerList
