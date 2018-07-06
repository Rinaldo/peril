import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { ItemTypes } from '../utils'

import BoardCell from './BoardCell'
import BoardCellModal from './BoardCellModal'


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

const BoardCellDragAndDroppable = ({ connectDropTarget, connectDragSource, ...propsToPass }) => {
  return connectDragSource(connectDropTarget(
    <div>
      {propsToPass.cell.empty ? <BoardCellModal initialState={{ isPublic: true }} {...propsToPass} /> : <BoardCell {...propsToPass} />}
    </div>
  ))
}

const droppable = DropTarget([ItemTypes.QUESTION_FROM_LIST, ItemTypes.QUESTION_FROM_BOARD], cellTarget, collectDrop)(BoardCellDragAndDroppable)
const dragAndDroppable = DragSource(ItemTypes.QUESTION_FROM_BOARD, cellSource, collectDrag)(droppable)

export default dragAndDroppable
