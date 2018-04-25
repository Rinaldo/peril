import React, { Component } from 'react'
import { Button, Checkbox, Form, Input, Radio, Select, TextArea } from 'semantic-ui-react'

import { db } from '../firebase'

const parseTags = tagString =>
  (tagString ?
  tagString.split(',').reduce((obj, key) => {
    const trimmed = key.trim()
    return { ...obj, [trimmed]: true }
  }, {})
  : {})

  const initialState = {
    prompt: '',
    response: '',
    isPublic: true,
    tags: '',
  }

class QuestionInput extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = initialState
  }

  handleChange(_, { name, value, checked }) {
    this.setState({ [name]: value !== undefined ? value : checked })
  }

  handleSubmit() {
    db.collection('questions').add({
      prompt: this.state.prompt,
      response: this.state.response,
      isPublic: this.state.isPublic,
      tags: parseTags(this.state.tags)
    })
    .then(() => console.log('Document written successfully'))
    .catch(err => console.log('Error writing document', err))
    this.setState(initialState)
  }

  render() {
    return (
      <Form>
        <Form.TextArea
          autoHeight
          rows={2}
          name="prompt"
          label="Prompt"
          placeholder="This document was famously adopted in the summer of 1776"
          value={this.state.prompt}
          onChange={this.handleChange} />
        <Form.Input
          name="response"
          label="Response"
          placeholder="What is the Declaration of Independence"
          value={this.state.response}
          onChange={this.handleChange} />
        <Form.Input
          name="tags"
          label="Enter any number of tags separated by commas"
          placeholder="History, American History, Revolution"
          value={this.state.tags}
          onChange={this.handleChange} />
        <Form.Checkbox
          defaultChecked={true}
          name="isPublic"
          label="Make my question public"
          onChange={this.handleChange} />
        <Form.Button
          content="Submit"
          disabled={!(this.state.prompt && this.state.response)}
          onClick={this.handleSubmit} />
      </Form>
    )
  }
}

export default QuestionInput
