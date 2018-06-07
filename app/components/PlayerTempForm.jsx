import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'

class NameForm extends Component {
  constructor(props) {
    super(props)
    this.initialState = this.state = {}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(_, { name, value }) {
    this.setState({ [name]: value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.submit(this.state)
    this.setState(this.initialState)
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          name="name"
          type="Enter a name to join"
          value={this.state.name || ''}
          onChange={this.handleChange}
        />
        <Form.Button
          type="submit"
          content="Join"
        />
      </Form>
    )
  }
}

export default NameForm
