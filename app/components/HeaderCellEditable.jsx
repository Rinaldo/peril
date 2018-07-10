import React, { Component } from 'react'
import { Popup } from 'semantic-ui-react'

import CategoryForm from './CategoryForm'
import HeaderCell from './HeaderCell'

class HeaderCellEditable extends Component {

  constructor(props) {
    super(props)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.setHeader = this.props.setHeader.bind(this, this.props.index)
    this.state = { isOpen: false }
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
          <div>
            <HeaderCell {...this.props} />
          </div>
        }
        content={
          <CategoryForm
            submit={this.setHeader}
            secondarySubmit={this.handleClose}
            initialState={{ category: this.props.header }}
          />
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

export default HeaderCellEditable
