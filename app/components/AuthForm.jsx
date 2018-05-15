import React, { Component } from 'react'
import { Form, Loader } from 'semantic-ui-react'


class AuthForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const { name, email, password } = this.state
    this.props.submit(email, password, name)
    this.setState({ authLoading: true })
    }

  handleChange(_, { name, value }) {
    this.setState({ [name]: value })
  }

  render() {
    return this.state.authLoading ? <Loader /> : (
      <Form onSubmit={this.handleSubmit}>
        {this.props.formFields.map(field => (
          <Form.Input
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            value={this.state[field.name]}
            onChange={this.handleChange}
          />
        ))}
        <Form.Button
          content={this.props.method}
          type="submit"
        />
      </Form>
    )
  }
}

export default AuthForm
