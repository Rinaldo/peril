import React from 'react'
import { Form } from 'semantic-ui-react'


const NewQuestionForm = props => (
  <Form>
    <Form.TextArea
      autoHeight
      rows={2}
      name="prompt"
      label="Prompt"
      placeholder="This document was famously adopted in the summer of 1776"
      value={props.formState.prompt || ''}
      onChange={props.handleChange}
    />
    <Form.Input
      name="response"
      label="Response"
      placeholder="What is the Declaration of Independence"
      value={props.formState.response || ''}
      onChange={props.handleChange}
    />
    <Form.Input
      name="tags"
      label="Enter any number of tags separated by commas"
      placeholder="American History, History"
      value={props.formState.tags || ''}
      onChange={props.handleChange}
    />
    <Form.Checkbox
      checked={props.formState.isPublic}
      name="isPublic"
      label="Make my question public"
      onChange={props.handleChange}
    />
  </Form>
)

export default NewQuestionForm
