import React, { Component } from 'react'
import { Form, Modal, Button } from 'semantic-ui-react'


const initialState = {
  title: '',
  description: '',
  isPublic: true,
  height: 5,
  width: 6,
  multiplier: 200,
}

class QuestionInput extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = initialState
  }

  handleChange(_, { name, value, checked, type }) {
    if (value === undefined) value = checked
    else if (value && type === 'number') value = +value
    this.setState({ [name]: value === undefined ? checked : value })
  }

  handleSubmit() {
    this.props.createGame({ ...this.state })
  }

  render() {
    return (
      <Modal closeIcon trigger={<Button>Create New Game</Button>}>
        <Modal.Header>Create New Game</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              name="title"
              type="text"
              label="Title"
              placeholder="Enter a title"
              value={this.state.title}
              onChange={this.handleChange}
            />
            <Form.TextArea
              autoHeight
              rows={2}
              name="description"
              type="text"
              label="Description"
              placeholder="Enter a description"
              value={this.state.description}
              onChange={this.handleChange}
            />
            <Form.Group widths="equal">
              <Form.Input
                name="width"
                type="number"
                label="Number of Categories"
                value={this.state.width}
                onChange={this.handleChange}
              />
              <Form.Input
                name="height"
                type="number"
                label="Questions per Category"
                value={this.state.height}
                onChange={this.handleChange}
              />
              <Form.Input
                name="multiplier"
                type="number"
                label="Base Points"
                value={this.state.multiplier}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Checkbox
              defaultChecked={true}
              name="isPublic"
              label="Make this game public"
              onChange={this.handleChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button positive icon="checkmark" labelPosition="right" content="Create Game" onClick={this.handleSubmit} />
        </Modal.Actions>
      </Modal>
    )
  }
}

export default QuestionInput
