import React from 'react'
import { Table } from 'semantic-ui-react'

import BoardCell from './BoardCell'

/* eslint-disable react/no-array-index-key */
const Board = ({ clearQuestion, game, ...propsToPass }) => {
    // console.log('game', game)
    return (
      <Table fixed unstackable size="large" attached="top">
        <Table.Header>
          <Table.Row textAlign="center">
            {game.headers.map((header, headerIndex) => (
              <Table.HeaderCell key={`row-${headerIndex}`}>{header}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body onMouseLeave={clearQuestion}>
          {game.rows.map((row, rowIndex) => (
            <Table.Row key={`row-${rowIndex}`} textAlign="center">
              {row.map((cell, colIndex) => (
                <Table.Cell
                  style={{ padding: '0px' }}
                  key={`cell-${rowIndex}:${colIndex}`}
                >
                  <BoardCell
                    cell={cell}
                    multiplier={game.multiplier}
                    row={rowIndex}
                    col={colIndex}
                    {...propsToPass}
                  />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }

export default Board
