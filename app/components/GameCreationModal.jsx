import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'

import NewGameFields from './NewGameFields'


class QuestionInput extends Component {

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
    if (event) event.preventDefault()
    const { modalOpen, ...state } = this.state   // eslint-disable-line no-unused-vars
    this.props.writeQuestion(state)
    this.setState(prevState =>
      Object.assign({},
        Object.keys(prevState).reduce((obj, key) => {
          obj[key] = null
          return obj
        }, {}),
        this.props.initialState,
        { modalOpen: false }
      )
    )
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
        trigger={<Button onClick={this.handleOpen}>Create New Game</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>Create New Game</Modal.Header>
        <Modal.Content>
          <NewGameFields
            handleChange={this.handleChange}
            formState={this.state}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button negative icon="close" labelPosition="right" content="Cancel" onClick={this.handleClose} />
          <Button positive icon="checkmark" labelPosition="right" content="Create Game" onClick={this.handleSubmit} />
        </Modal.Actions>
      </Modal>
    )
  }
}

export default QuestionInput
