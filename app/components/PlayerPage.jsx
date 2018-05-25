import React from 'react'
import { Button } from 'semantic-ui-react'
import { firebaseConnect } from '../fire-connect'
import { formatGame } from '../utils'

import NameForm from './PlayerTempForm'

const PlayerPage = props => {
  console.log(props)
  const inGame = props.isLoaded && props.user && props.players[props.user.uid] && props.players[props.user.uid].active
  const answered = props.isLoaded && props.user && props.responseQueue[props.user.uid]
  return props.isLoaded ?
    (
      <div>
        {
          inGame ?
          <div>
            {
              props.game.started ?
              <div>
                {
                  props.game.currentQuestion && !answered ?
                  <div>
                    {props.game.currentQuestion.prompt}
                    <Button onClick={props.answerQuestion}>Buzz In</Button>
                  </div>
                  :
                  props.game.currentQuestion && answered ?
                  <div>
                    Submitted
                  </div>
                  :
                  <div>
                    Waiting for Question
                  </div>
                }
              </div>
              :
              <div>
                Waiting for host to begin game
              </div>
            }
            <Button onClick={props.leaveGame}>Leave Game</Button>
          </div>
          :
          <div>
            <p>Welcome to Peril</p>
            <NameForm submit={props.joinGame} />
          </div>
        }
      </div>
    )
      :
    null
}

function addListener(component, ref) {
  return ref(`games/${component.props.match.params.hostId}/client`).on('value', snapshot => {
    if (!snapshot.exists()) {
      console.log('no game found')
      return
    }
    console.log(snapshot.val())
    const { gameInfo, players, responseQueue, ...game } = snapshot.val()
    component.setState({
      game,
      gameInfo: formatGame(gameInfo),
      players: players || [],
      responseQueue: responseQueue || [],
      isLoaded: true
    })
  })
}

function addDispatchers(component, ref) {
  return {
    joinGame({ name }) {
      // will this fail if the user has already signed in?
      component.props.auth.signInAnonymously()
      .then(user => {
        // console.log('host id:', component.props.match.params.hostId, ' uid:', user.uid)
        return ref(`games/${component.props.match.params.hostId}/client/players/${user.uid}`).set({
          name,
          score: 0,
          active: true,
        })
      })
      .catch(err => console.error('Error:', err))
    },
    answerQuestion() {
      ref(`games/${component.props.match.params.hostId}/client/responseQueue/${component.props.user.uid}`).set(component.props.firebaseTimestamp)
      .catch(err => console.error('Error:', err))
    },
    leaveGame() {
      ref(`games/${component.props.match.params.hostId}/client/players/${component.props.user.uid}`).update({
        active: false
      })
      .catch(err => console.error('Error:', err))
      component.props.user.isAnonymous && component.props.auth.signOut()
    },
  }
}

export default firebaseConnect(addListener, addDispatchers)(PlayerPage)
