import React from 'react'
import { Table } from 'semantic-ui-react'


/* eslint-disable react/no-array-index-key */
const Board = ({ cellComponent, headerComponent, clearQuestion, game, ...propsToPass }) => {
    // console.log('game', game)
    return (
      <Table fixed unstackable size="large" attached>
        <Table.Header>
          <Table.Row textAlign="center">
            {game.headers.map((header, headerIndex) => (
              <Table.HeaderCell style={{ padding: '0px' }} key={`row-${headerIndex}`}>
              {React.createElement(headerComponent, { header, index: headerIndex, ...propsToPass })}
                {/* <HeaderCell
                  header={header}
                  index={headerIndex}
                  {...propsToPass}
                /> */}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body onMouseLeave={clearQuestion}>
          {game.rows.map((row, rowIndex) => (
            <Table.Row key={`row-${rowIndex}`} textAlign="center">
              {row.map((cell, colIndex) => (
                <Table.Cell style={{ padding: '0px' }} key={`cell-${rowIndex}:${colIndex}`}>
                {React.createElement(cellComponent, { cell, multiplier: game.multiplier, currentCoords: [rowIndex, colIndex], ...propsToPass })}
                  {/* <BoardCell
                    cell={cell}
                    multiplier={game.multiplier}
                    row={rowIndex}
                    col={colIndex}
                    {...propsToPass}
                  /> */}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }

export default Board
