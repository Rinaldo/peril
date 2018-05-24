import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'


// const parseTags = tagString =>
//   (tagString ?
//   tagString.split(',').reduce((obj, key) => {
//     const trimmed = key.trim()
//     return { ...obj, [trimmed]: true }
//   }, {})
//   : {})


class QuestionInput extends Component {

  constructor(props) {
    super(props)
    this.initialState = this.props.initialState || {}
    this.state = this.initialState
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(_, { name, value, checked }) {
    this.setState({ [name]: value !== undefined ? value : checked })
  }

  handleSubmit() {
    this.props.submit(this.state)
    this.setState(this.initialState)
    console.log('tags not currently supported')
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.TextArea
          autoHeight
          rows={2}
          name="prompt"
          label="Prompt"
          placeholder="This document was famously adopted in the summer of 1776"
          value={this.state.prompt || ''}
          onChange={this.handleChange}
        />
        <Form.Input
          name="response"
          label="Response"
          placeholder="What is the Declaration of Independence"
          value={this.state.response || ''}
          onChange={this.handleChange}
        />
        <Form.Input
          name="tags"
          label="Enter any number of tags separated by commas"
          placeholder="American History, History"
          value={this.state.tags || ''}
          onChange={this.handleChange}
        />
        <Form.Checkbox
          defaultChecked={true}
          name="isPublic"
          label="Make my question public"
          checked={this.state.isPublic}
          onChange={this.handleChange}
        />
        <Form.Button
          content="Save Question"
          type="submit"
          disabled={!(this.state.prompt && this.state.response)}
        />
      </Form>
    )
  }
}

export default QuestionInput
