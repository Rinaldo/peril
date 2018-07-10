import React from 'react'
import { Form } from 'semantic-ui-react'

import FormWrapper from './FormWrapper'


const CategoryForm = props => (
  <Form onSubmit={props.handleSubmit}>
    <Form.Input
      name="category"
      placeholder="Enter category..."
      value={props.formState.category || ''}
      onChange={props.handleChange}
    />
  </Form>
)
export default FormWrapper(CategoryForm)
