import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'

import NewGameFields from './NewGameFields'


class QuestionInput extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = this.props.initialState
  }

  handleChange(_, { name, value, checked, type }) {
    if (value === undefined) value = checked
    else if (value && type === 'number') value = +value
    this.setState({ [name]: value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.createGame(this.state)
    this.setState(this.props.initialState)
  }

  render() {
    return (
      <Modal closeIcon trigger={<Button>Create New Game</Button>}>
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
