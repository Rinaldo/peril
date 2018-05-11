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
    this.SignupOrLogin = this.SignupOrLogin.bind(this)
  }

  SignupOrLogin(evt) {
    const { name, email, password } = this.state
    evt.preventDefault()
    this.props.method === 'Sign up' && this.props.emailSignup(name, email, password)
    this.props.method === 'Log in' && this.props.emailLogin(email, password)
    this.setState({ authLoading: true })
    }

  handleChange(_, { name, value }) {
    this.setState({ [name]: value })
  }

  render() {
    return this.state.authLoading ? <Loader /> : (
      <Form>
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
          onClick={this.SignupOrLogin}
        />
      </Form>
    )
  }
}

export default AuthForm
