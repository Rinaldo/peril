import React from 'react'


const BoardCell = (
  // {
  // multiplier,
  // cell,
  // row,
  // col,
  // selectedCoords: [selectedRow, selectedCol],
  // locked,
  // selectQuestion,
  // toggleLock,
  // }
  ) => {
  // console.log('boardCell props', props)
  return (
    <p>testing</p>
    // <div
    //   style={{ padding: '1em' }}
    //   className={
    //     (row === selectedRow &&
    //       col === selectedCol &&
    //       locked) ? 'selectable-cell locked-selectable-cell'
    //       : !cell ? 'selectable-cell empty-cell'
    //       : 'selectable-cell'}
    //   row={row}
    //   col={col}
    //   onMouseEnter={selectQuestion}
    //   onClick={toggleLock}
    // >
    //   {(row + 1) * multiplier}
    // </div>
  )
}

export default BoardCell
