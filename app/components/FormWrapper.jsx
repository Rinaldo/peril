import React, { Component } from 'react'


const Wrapper = Form => class FormWrapper extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = this.props.initialState || {}
  }

  handleChange(_, { name, value, checked, type }) {
    if (value === undefined) value = checked
    else if (value && type === 'number') value = +value
    this.setState({ [name]: value })
  }

  handleSubmit(event) {
    event.preventDefault()
    if (this.props.submit) this.props.submit(this.state)
    if (this.props.secondarySubmit) this.props.secondarySubmit(this.state)
    this.setState(prevState =>
      Object.assign({},
        Object.keys(prevState).reduce((obj, key) => {
          obj[key] = null
          return obj
        }, {}),
        this.props.initialState
      )
    )
  }

  render() {
    return (
      <Form
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        formState={this.state}
        {...this.props}
      />
    )
  }
}

export default Wrapper
