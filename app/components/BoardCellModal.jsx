import React, { Component } from 'react'
import { Modal, Form, Button } from 'semantic-ui-react'

import BoardCell from './BoardCell'


class BoardCellModal extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.state = this.props.initialState ? { modalOpen: false, ...this.props.initialState } : { modalOpen: false }
  }

  handleChange(_, { name, value, checked }) {
    this.setState({ [name]: value === undefined ? checked : value })
  }

  handleSubmit() {
    const { modalOpen, ...formState } = this.state
    this.setState({ modalOpen: false })
    this.props.writeQuestion(formState)
    .then(docRef => docRef.get())
    .then(doc => doc.data())
    .then(createdQuestion => this.props.addQuestionToGame(createdQuestion, ...this.props.currentCoords))
    .catch(err => console.error('Error adding question', err))
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
          <Form onSubmit={this.handleSubmit}>
            <Form.TextArea
              autoHeight
              rows={2}
              name="prompt"
              label="Prompt"
              placeholder="This document was famously adopted in the summer of 1776"
              value={this.state.prompt || ''}
              onChange={this.handleChange}
            />
            <Form.Input
              name="response"
              label="Response"
              placeholder="What is the Declaration of Independence"
              value={this.state.response || ''}
              onChange={this.handleChange}
            />
            <Form.Input
              name="tags"
              label="Enter any number of tags separated by commas"
              placeholder="American History, History"
              value={this.state.tags || ''}
              onChange={this.handleChange}
            />
            <Form.Checkbox
              checked={this.state.isPublic}
              name="isPublic"
              label="Make my question public"
              onChange={this.handleChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive icon="checkmark" labelPosition="right" content="Create Question" onClick={this.handleSubmit} />
        </Modal.Actions>
      </Modal>
    )
  }
}

export default BoardCellModal
