import React from 'react'
import { firebaseConnect } from '../firebase'
import { formatGame } from '../utils'

import Board from './Board'
import BoardCell1 from './BoardCell1'
import HeaderCell1 from './HeaderCell1'

const GameHost = props => {
  console.log('rendering host game')
  return props.isLoaded ? (
    <Board
      cellComponent={BoardCell1}
      headerComponent={HeaderCell1}
      game={props.gameInfo}
    />
  ) : null
}

function addListener(component, rt) {
  rt.ref(`games/${component.props.match.params.gameId}`).on('value', snapshot => {
    const { gameInfo, ...game } = snapshot.val()
    component.setState({ game, gameInfo: formatGame(gameInfo), isLoaded: true })
  })
}

export default firebaseConnect(addListener)(GameHost)
