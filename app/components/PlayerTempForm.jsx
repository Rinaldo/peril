import React from 'react'
import { Form } from 'semantic-ui-react'

import FormWrapper from './FormWrapper'

const NameForm = props => (
  <Form onSubmit={props.handleSubmit}>
    <Form.Input
      name="name"
      type="Enter a name to join"
      value={props.formState.name || ''}
      onChange={props.handleChange}
    />
    <Form.Button
      type="submit"
      content="Join"
    />
  </Form>
)

export default FormWrapper(NameForm)
