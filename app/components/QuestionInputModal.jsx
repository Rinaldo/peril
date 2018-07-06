import React, { Component } from 'react'
import { Form, Modal, Button } from 'semantic-ui-react'


class QuestionInputModal extends Component {

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
    const { modalOpen, ...formState } = this.state // eslint-disable-line no-unused-vars
    this.setState({ modalOpen: false })
    this.props.writeQuestion(formState)
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
        trigger={<Button onClick={this.handleOpen}>Create New Question</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>Create Question</Modal.Header>
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

export default QuestionInputModal
