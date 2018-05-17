import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { ItemTypes } from '../utils'


const cellTarget = {
  drop(props, monitor) {
    const { draggedQuestion, draggedCoords } = monitor.getItem()
    const draggedRow = draggedCoords ? draggedCoords[0] : null
    const draggedCol = draggedCoords ? draggedCoords[1] : null
    const { cell: targetQuestion, currentCoords: [targetRow, targetCol] } = props

    if (monitor.getItemType() === ItemTypes.QUESTION_FROM_LIST) {
      props.addQuestionToGame(draggedQuestion, targetRow, targetCol)
    } else {
      props.swapQuestions(draggedQuestion, targetRow, targetCol, targetQuestion, draggedRow, draggedCol)
    }
    props.selectQuestion(null, true, props.currentCoords)
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
      draggedQuestion: props.cell,
      draggedCoords: props.currentCoords
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
  currentCoords: [currentRow, currentCol],
  selectedCoords: [selectedRow, selectedCol],
  locked,
  selectQuestion,
  toggleLock,
  }) => {
  // console.log('boardCell props', [currentRow, currentCol])
  return connectDragSource(connectDropTarget(
    <div
      style={{ padding: '1em' }}
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
  ))
}

const droppable = DropTarget([ItemTypes.QUESTION_FROM_LIST, ItemTypes.QUESTION_FROM_BOARD], cellTarget, collectDrop)(BoardCell)
const dragAndDroppable = DragSource(ItemTypes.QUESTION_FROM_BOARD, cellSource, collectDrag)(droppable)

export default dragAndDroppable
