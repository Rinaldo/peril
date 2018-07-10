import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'

import BoardCell from './BoardCell'
import NewQuestionFields from './NewQuestionFields'

/*
 * Very similar to QuestionInputModal
*/
class BoardCellModal extends Component {

  constructor(props) {
    super(props)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = this.props.initialState ? { modalOpen: false, ...this.props.initialState } : { modalOpen: false }
  }

  handleChange(_, { name, value, checked, type }) {
    if (value === undefined) value = checked
    else if (value && type === 'number') value = +value
    this.setState({ [name]: value })
  }

  handleSubmit(event) {
    event.preventDefault()
    const { modalOpen, ...state } = this.state   // eslint-disable-line no-unused-vars
    console.log('props:', this.props)
    console.log('state:', this.state)
    this.props.writeQuestion(state)
    .then(docRef => docRef.get())
    .then(doc => doc.data())
    .then(createdQuestion => this.props.addQuestionToGame(createdQuestion, ...this.props.currentCoords))
    .catch(err => console.error('Error adding question', err))
    this.handleClose()
  }

  handleOpen() {
    this.setState({ modalOpen: true })
  }

  handleClose() {
    this.setState({ modalOpen: false })
  }

  render() {
    return (
      <Modal
        closeIcon
        trigger={<div onClick={this.handleOpen}><BoardCell {...this.props} /></div>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>Create And Add Question To Game</Modal.Header>
        <Modal.Content>
        <NewQuestionFields
            handleChange={this.handleChange}
            formState={this.state}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button negative icon="close" labelPosition="right" content="Cancel" onClick={this.handleClose} />
          <Button positive icon="checkmark" labelPosition="right" content="Create Question" onClick={this.handleSubmit} />
        </Modal.Actions>
      </Modal>
    )
  }
}

export default BoardCellModal
