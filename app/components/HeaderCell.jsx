import React from 'react'


const HeaderCell = props => {
  return (
    <p
      style={{ padding: '1em', cursor: 'default' }}
      className={props.header ? null : 'default-color'}
    >
      {props.header || `Category ${props.index + 1}`}
    </p>
  )
}

export default HeaderCell
