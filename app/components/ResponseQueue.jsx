import React from 'react'
import { Button, List } from 'semantic-ui-react'

const ResponseQueue = props => {
  return (
    <>
      {props.responses.length ?
        <List>
          {props.responses.map((response, index) => (
            <List.Item key={response.uid}>
              <List.Content>
                {response.name}
                {index === 0 &&
                  <>
                    <Button
                      compact
                      content="correct"
                      onClick={() => props.markAsCorrect(response)}
                    />
                    <Button
                      compact
                      content="incorrect"
                      onClick={() => props.markAsIncorrect(response)}
                    />
                  </>
                }
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
