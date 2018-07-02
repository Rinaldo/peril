import React from 'react'


const BoardCellBasic = ({ cell, currentCoords: [currentRow, currentCol] }) => {
  return (
    <div
      style={{ padding: '1em', fontWeight: cell && cell.double ? 'bold' : 'normal' }}
      row={currentRow}
      col={currentCol}
    >
      {cell.points}
    </div>
  )
}

export default BoardCellBasic
