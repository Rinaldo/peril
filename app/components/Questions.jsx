import React, { Component } from 'react'
import { Item, Menu, Segment, Input, Loader, Label } from 'semantic-ui-react'

import { db } from '../firebase'

class Questions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      init: true
    }
  }

  componentDidMount() {
    db.collection('questions').where('isPublic', '==', true)
      .onSnapshot(querySnapshot => {
          const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
          console.log(docsData)
          this.setState({ questions: docsData, init: false })
      })
  }

  render() {
    return (
      <div>
        <Menu attached='top'>
          <Menu.Item name='My Questions' />
          <Menu.Item position='right'>
            <Input transparent icon={{ name: 'search', link: true }} placeholder='Search questions...' />
          </Menu.Item>
        </Menu>
        <Segment attached='bottom'>
          {!this.state.init ? (<Item.Group divided>
            {this.state.questions.map(question => (
              <Item key={question.id}>
                <Item.Content verticalAlign='middle'>
                  <Item.Header>Prompt</Item.Header>
                  <Item.Description>{question.prompt}</Item.Description>
                  <Item.Header>Response</Item.Header>
                  <Item.Description>{question.response}</Item.Description>
                  <Item.Extra>
                    {Object.keys(question.tags).map(tag => (
                      <Label>{tag}</Label>
                    ))}
                  </Item.Extra>
                </Item.Content>
              </Item>
            ))}
          </Item.Group>)
          : <Loader />
          }
        </Segment>
      </div>)
  }
}

export default Questions
