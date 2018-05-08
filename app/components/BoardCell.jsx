import React from 'react'
import { DropTarget } from 'react-dnd'
import { ItemTypes } from '../utils'


const cellTarget = {
  drop(props, monitor) {
    console.log(monitor.getItem())
    props.saveQuestion(monitor.getItem(), props.row, props.col)
    props.selectQuestion(null, true, [props.row, props.col])
    // should also unlock selected
  }
};

function collect(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

const BoardCell = ({
  connectDropTarget,
  multiplier,
  cell,
  row,
  col,
  selectedCoords: [selectedRow, selectedCol],
  locked,
  selectQuestion,
  toggleLock,
  }) => {
  // console.log('boardCell props', props)
  return connectDropTarget(
    <div
      style={{ padding: '1em' }}
      className={
        (row === selectedRow &&
          col === selectedCol &&
          locked) ? 'selectable-cell locked-selectable-cell'
          : !cell ? 'selectable-cell empty-cell'
          : 'selectable-cell'}
      row={row}
      col={col}
      onMouseEnter={selectQuestion}
      onClick={toggleLock}
    >
      {(row + 1) * multiplier}
    </div>
  )
}

export default DropTarget([ItemTypes.QUESTION_FROM_LIST, ItemTypes.QUESTION_FROM_BOARD], cellTarget, collect)(BoardCell)
