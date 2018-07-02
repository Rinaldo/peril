import React from 'react'
import { Loader } from 'semantic-ui-react'
import { firebaseConnect } from 'fire-connect'
import { formatGame } from '../utils'

import Board from './Board'
import BoardCellBasic from './BoardCellBasic'
import HeaderCell from './HeaderCell'
import PlayerInfo from './PlayerInfo'

const Spectator = ({ isLoaded, game }) => {
  return isLoaded ? (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ width: '75%', height: '100%' }}>
        <Board
          game={game}
          renderCell={(cell, multiplier, currentCoords) => (
            <BoardCellBasic
              cell={cell}
              multiplier={multiplier}
              currentCoords={currentCoords}
            />
          )}
          renderHeader={(header, index) => (
            <HeaderCell
              header={header}
              index={index}
            />
          )}
        />
      </div>
      <div style={{ width: '25%', height: '100%', minWidth: '300px' }}>
        <PlayerInfo />
      </div>
    </div>
  ) : <Loader active />
}

const addListener = (connector, ref) => (
  ref(`games/${connector.props.match.params.hostId}/client/gameInfo`).on('value', snapshot => {
    if (!snapshot.exists()) {
      connector.setState({ error: { message: 'Game Not Found' }, isLoaded: true })
      return
    }
    const formatted = formatGame(snapshot.val())
    console.log('​snapshot.val()', snapshot.val());
    console.log('​formatted', formatted);
    connector.setState({ game: formatted, isLoaded: true })
  })
)

export default firebaseConnect(addListener)(Spectator)
