import React from 'react'

import PlayerInfo from './PlayerInfo'
import SubHeaderHost from './SubHeaderHost'
import GameInfoHost from './GameInfoHost'


const GameHost = () => {
  return (
    <div style={{ height: '100%' }}>
      <SubHeaderHost />
      <div style={{ display: 'flex', height: 'calc(100% - 120px)' }}>
        <div style={{ width: '75%', height: '100%' }}>
          <GameInfoHost />
        </div>
        <div style={{ width: '25%', height: '100%', minWidth: '300px' }}>
          <PlayerInfo />
        </div>
      </div>
    </div>
  )
}

export default GameHost
