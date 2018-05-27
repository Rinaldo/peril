import React from 'react'


const BoardCell = ({
  multiplier,
  cell,
  currentCoords: [currentRow, currentCol],
  selectedCoords: [selectedRow, selectedCol],
  locked,
  selectQuestion,
  toggleLock,
  }) => {
  // console.log('rendering BoardCell1')
  // console.log('boardCell props', [currentRow, currentCol])
  return (
    <div
      style={{ padding: '1em', fontWeight: cell && cell.double ? 'bold' : 'normal' }}
      className={
        (currentRow === selectedRow &&
          currentCol === selectedCol &&
          locked) ? 'selectable-cell locked-selectable-cell'
          : !cell ? 'selectable-cell empty-cell'
          : 'selectable-cell'}
      row={currentRow}
      col={currentCol}
      onMouseEnter={selectQuestion}
      onClick={toggleLock}
    >
      {(currentRow + 1) * multiplier}
    </div>
  )
}

export default BoardCell
