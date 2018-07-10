import React from 'react'
import { Form } from 'semantic-ui-react'

import FormWrapper from './FormWrapper'


const LoginFields = props => (
  <Form onSubmit={props.handleSubmit}>
    <Form.Input
      name="email"
      label="Email"
      type="text"
      placeholder="email@example.com"
      value={props.formState.email || ''}
      onChange={props.handleChange}
    />
    <Form.Input
      name="password"
      label="Password"
      type="password"
      value={props.formState.password || ''}
      onChange={props.handleChange}
    />
    <Form.Button
      content="Log in"
      type="submit"
    />
  </Form>
)

const SignUpFields = props => (
  <Form onSubmit={props.handleSubmit}>
    <Form.Input
      name="name"
      label="Name"
      type="text"
      placeholder="Jane Doe"
      value={props.formState.name || ''}
      onChange={props.handleChange}
    />
    <Form.Input
      name="email"
      label="Email"
      type="text"
      placeholder="email@example.com"
      value={props.formState.email || ''}
      onChange={props.handleChange}
    />
    <Form.Input
      name="password"
      label="Password"
      type="password"
      value={props.formState.password || ''}
      onChange={props.handleChange}
    />
    <Form.Button
      content="Sign up"
      type="submit"
    />
  </Form>
)

export const LoginForm = FormWrapper(LoginFields)
export const SignUpForm = FormWrapper(SignUpFields)
