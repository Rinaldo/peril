import React, { Component } from 'react'
import { Button, Dropdown, Icon } from 'semantic-ui-react'

import AuthForm from './AuthForm'


class AuthDropdown extends  Component {

  constructor(props) {
    super(props)
    this.state = {
      byEmail: false,
    }
    this.chooseEmail = this.chooseEmail.bind(this)
  }

  chooseEmail() { this.setState({ byEmail: true }) }

  render() {
    return (
      <Dropdown simple text={this.props.method} icon={false} style={{ padding: '.93em 1.14em' }}>
        <Dropdown.Menu>
          {this.state.byEmail ? <AuthForm {...this.props} /> :
            <React.Fragment>
              <Dropdown.Item>
                <Button color="google plus" onClick={this.props.googleLogin}>
                  <Icon name="google" /> {this.props.method} with Google
                </Button>
              </Dropdown.Item>
              <Dropdown.Item>
                <Button onClick={this.chooseEmail}>
                  <Icon name="mail" /> {this.props.method} with Email
                </Button>
              </Dropdown.Item>
            </React.Fragment>
          }
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default AuthDropdown
