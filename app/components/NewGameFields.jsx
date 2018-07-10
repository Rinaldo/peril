import React from 'react'
import { Form } from 'semantic-ui-react'


const NewGameForm = props => (
  <Form>
    <Form.Input
      name="title"
      type="text"
      label="Title"
      placeholder="Enter a title"
      value={props.formState.title || ''}
      onChange={props.handleChange}
    />
    <Form.TextArea
      autoHeight
      rows={2}
      name="description"
      type="text"
      label="Description"
      placeholder="Enter a description"
      value={props.formState.description || ''}
      onChange={props.handleChange}
    />
    <Form.Group widths="equal">
      <Form.Input
        name="width"
        type="number"
        label="Number of Categories"
        value={props.formState.width || 1}
        onChange={props.handleChange}
      />
      <Form.Input
        name="height"
        type="number"
        label="Questions per Category"
        value={props.formState.height || 1}
        onChange={props.handleChange}
      />
      <Form.Input
        name="multiplier"
        type="number"
        label="Base Points"
        value={props.formState.multiplier || 1}
        onChange={props.handleChange}
      />
    </Form.Group>
    <Form.Checkbox
      checked={props.formState.isPublic}
      name="isPublic"
      label="Make props game public"
      onChange={props.handleChange}
    />
  </Form>
)

export default NewGameForm
