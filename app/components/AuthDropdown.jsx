import React, { Component } from 'react'
import { Button, Dropdown, Icon } from 'semantic-ui-react'

import { LoginForm, SignUpForm } from './AuthForms'


const MethodsDropDown = ({ chooseEmail, googleLogin, method }) => (
  <>
    <Dropdown.Item>
      <Button color="google plus" onClick={googleLogin}>
        <Icon name="google" /> {method} with Google
      </Button>
    </Dropdown.Item>
    <Dropdown.Item>
      <Button onClick={chooseEmail}>
        <Icon name="mail" /> {method} with Email
      </Button>
    </Dropdown.Item>
  </>
)

const EmailForm = ({ method, submit }) => {
  const authActions = {
    'Log in': <LoginForm submit={submit} />,
    'Sign up': <SignUpForm submit={submit} />,
  }
  return authActions[method] || null
}


class AuthDropdown extends  Component {

  constructor(props) {
    super(props)
    this.state = { byEmail: false }
    this.chooseEmail = this.chooseEmail.bind(this)
  }

  chooseEmail() {
    this.setState({ byEmail: true })
  }

  render() {
    return (
      <Dropdown simple text={this.props.method} icon={false} style={{ padding: '.93em 1.14em' }}>
        <Dropdown.Menu>
          {this.state.byEmail
            ? <EmailForm
                method={this.props.method}
                submit={this.props.submit}
              />
            : <MethodsDropDown
                chooseEmail={this.chooseEmail}
                googleLogin={this.props.googleLogin}
                method={this.props.method}
              />
          }
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default AuthDropdown
