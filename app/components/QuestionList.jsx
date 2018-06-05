import React from 'react'
import { Item, Menu, Segment, Input, Loader } from 'semantic-ui-react'
import { firestoreConnect } from '../fire-connect'


const Questions = (props) => {
  // console.log('props', props)
  return (
    <div style={{ height: '100%' }}>
      <Menu attached widths={2}>
        <Menu.Item name="My Questions" />
        <Menu.Item name="Top Questions" style={{ color: 'rgb(212, 212, 212)' }} />
      </Menu>
      <Segment attached style={{ height: '40px', paddingTop: '10px' }}>
        <Input
          disabled
          transparent
          icon={{ name: 'search', link: true }}
          style={{ display: 'block' }}
          placeholder="Search Questions..."
        />
      </Segment>
      <Segment attached style={{ overflowY: 'auto', height: 'calc(100% - 80px)' }}>
        {props.isLoaded ?
          <Item.Group divided>
            {props.questions.map(question => (
              props.questionItem(question)
            ))}
          </Item.Group>
        : <Loader active />}
      </Segment>
    </div>
  )
}

const addListener = (component, db) => (
  db.collection('questions').where('isPublic', '==', true)
  .onSnapshot(querySnapshot => {
      const docsData = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
      component.setState({ questions: docsData, isLoaded: true })
  })
)

export default firestoreConnect(addListener)(Questions)
