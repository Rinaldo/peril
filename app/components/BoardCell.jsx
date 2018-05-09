import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { ItemTypes } from '../utils'


const cellTarget = {
  drop(props, monitor) {
    const { question: draggedQuestion, row: draggedRow, col: draggedCol } = monitor.getItem()
    const { cell: targetQuestion, row: targetRow, col: targetCol } = props

    if (monitor.getItemType() === ItemTypes.QUESTION_FROM_LIST) {
      props.addQuestionToGame(draggedQuestion, targetRow, targetCol)
    } else {
      props.swapQuestions(draggedQuestion, targetRow, targetCol, targetQuestion, draggedRow, draggedCol)
    }
    props.selectQuestion(null, true, [props.row, props.col])
    // should also unlock selected
  }
}

function collectDrop(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

const cellSource = {
  beginDrag(props) {
    return {
      question: props.cell,
      row: props.row,
      col: props.col,
    }
  }
}

function collectDrag(connect) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

const BoardCell = ({
  connectDropTarget,
  connectDragSource,
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
  return connectDragSource(connectDropTarget(
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
  ))
}

const droppable = DropTarget([ItemTypes.QUESTION_FROM_LIST, ItemTypes.QUESTION_FROM_BOARD], cellTarget, collectDrop)(BoardCell)
const dragAndDroppable = DragSource(ItemTypes.QUESTION_FROM_BOARD, cellSource, collectDrag)(droppable)

export default dragAndDroppable
