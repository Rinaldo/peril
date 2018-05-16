import React, { Component } from 'react'
import { Popup, Form, Input } from 'semantic-ui-react'


class HeaderCell extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.state = {
      category: props.header || '',
      isOpen: false,
    }
  }

  handleChange(_, { name, value }) {
    this.setState({ [name]: value })
  }

  handleSubmit() {
    this.props.setHeader(this.state.category, this.props.index)
    this.setState({ isOpen: false })
  }

  handleOpen() {
    this.setState({ isOpen: true })
  }

  handleClose() {
    this.setState({ isOpen: false })
  }

  render() {
    return (
      <Popup
        trigger={
          <p style={{ padding: '1em', cursor: 'default' }} className={this.props.header ? null : 'default-color'}>
            {this.props.header || `Category${this.props.index + 1}`}
          </p>
        }
        content={
          <Form onSubmit={this.handleSubmit}>
            <Input
              name="category"
              placeholder="Enter category..."
              value={this.state.category}
              onChange={this.handleChange}
            />
          </Form>
        }
        open={this.state.isOpen}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        hoverable
        position="bottom center"
      />
    )
  }
}

export default HeaderCell
