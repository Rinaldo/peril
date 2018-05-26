import React from 'react'

import PlayerInfo from './PlayerInfo'
import SubHeaderHost from './SubHeaderHost'
import GameInfoHost from './GameInfoHost'


const GameHost = props => {
  return (
    <div>
      <SubHeaderHost />
      <GameInfoHost />
      <PlayerInfo />
    </div>
  )
}

export default GameHost
