import React from 'react'
import { Table } from 'semantic-ui-react'

export const HeaderCellContent = props => {
  return (
    <p
      style={{ cursor: 'default' }}
      className={props.header ? null : 'default-color'}
    >
      {props.header || `Category ${props.index + 1}`}
    </p>
  )
}

const HeaderCell = props => {
  return (
    <Table.HeaderCell>
      <HeaderCellContent
        header={props.header}
        index={props.index}
      />
    </Table.HeaderCell>
  )
}

export default HeaderCell
