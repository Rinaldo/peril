import React, { Component } from 'react'
import { Item, Menu, Segment, Input, Loader } from 'semantic-ui-react'
import { db } from '../firebase'

import Question from './Question'

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
          const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), questionId: doc.id }))
          // console.log(docsData)
          this.setState({ questions: docsData, init: false })
      })
  }

  render() {
    return (
      <div className="questions">
        <Menu attached="top" widths={2}>
          <Menu.Item name="My Questions" />
          <Menu.Item name="Top Questions" />
        </Menu>
        <Segment attached style={{ height: '40px', paddingTop: '10px' }}>
        <Input transparent icon={{ name: 'search', link: true }} style={{ display: 'block' }} placeholder="Search Categories..." />
        </Segment>
        <Segment attached="bottom" style={{ overflowY: 'scroll', height: 'calc(100% - 80px)' }}>
          {!this.state.init ? (<Item.Group divided>
            {this.state.questions.map(question => (
              <Question key={question.questionId} question={question} />
            ))}
          </Item.Group>)
          : <Loader />
          }
        </Segment>
      </div>)
  }
}

export default Questions
