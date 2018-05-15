import React from 'react'
import { Item, Menu, Segment, Input, Loader } from 'semantic-ui-react'
import { fireConnect } from '../firebase'

import Question from './Question'


const Questions = (props) => {
  // console.log('props', props)
  return (
    <div className="questions">
      <Menu attached widths={2}>
        <Menu.Item name="My Questions" />
        <Menu.Item name="Top Questions" />
      </Menu>
      <Segment attached style={{ height: '40px', paddingTop: '10px' }}>
        <Input
          transparent
          icon={{ name: 'search', link: true }}
          style={{ display: 'block' }}
          placeholder="Search Questions..."
        />
      </Segment>
      <Segment attached style={{ overflowY: 'scroll', height: 'calc(100% - 80px)' }}>
        {props.isLoaded ? (<Item.Group divided>
          {props.questions.map(question => (
            <Question key={question.docId} question={question} />
          ))}
        </Item.Group>)
        : <Loader />}
      </Segment>
    </div>)
}

function addListener(component, db) {
  return db.collection('questions').where('isPublic', '==', true)
  .onSnapshot(querySnapshot => {
      const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
      component.setState({ questions: docsData, isLoaded: true })
  })
}

export default fireConnect(addListener)(Questions)
