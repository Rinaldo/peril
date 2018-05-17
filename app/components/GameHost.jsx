import React from 'react'
import { firebaseConnect } from '../firebase'
import { formatGame } from '../utils'

// import Board from './Board'
import GameInfo from './GameInfo'
import BoardCell from './BoardCell'
import HeaderCell from './HeaderCell'

const GameHost = props => {
  console.log('rendering host game')
  return props.isLoaded ? (
    <GameInfo
      cellComponent={BoardCell}
      headerComponent={HeaderCell}
      game={props.gameInfo}
      isLoaded={props.isLoaded}
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
