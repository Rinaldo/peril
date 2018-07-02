import React from 'react'
import { List } from 'semantic-ui-react'

const ResponseQueue = props => {
  return (
    <>
      {props.responses.length ?
        <List>
          {props.responses.map((player, index) => (
            <List.Item key={player.uid}>
              <List.Content style={{ fontSize: '1.2em' }} >
                <List.Header>
                {player.name}
                {index === 0 &&
                  <>
                    <List.Icon
                      name="check"
                      color="green"
                      onClick={() => props.markAsCorrect(player)}
                      style={{ marginLeft: '0.5em', cursor: 'pointer' }}
                    />
                    <List.Icon
                      name="close"
                      color="red"
                      onClick={() => props.markAsIncorrect(player)}
                      style={{ cursor: 'pointer' }}
                    />
                  </>
                }
                </List.Header>
              </List.Content>
            </List.Item>
          ))}
        </List>
        :
        'No responses yet'
      }
    </>
  )
}

export default ResponseQueue
