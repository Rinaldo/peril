import React, { Component } from 'react'
import { Popup, Table } from 'semantic-ui-react'

import CategoryForm from './CategoryForm'
import { HeaderCellContent } from './HeaderCell'

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
          // trigger cannot be a custom component, must be an html or semantic ui element
          <Table.HeaderCell>
            <HeaderCellContent
              header={this.props.header}
              index={this.props.index}
            />
          </Table.HeaderCell>
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
        verticalOffset={-12}
      />
    )
  }
}

export default HeaderCellEditable
