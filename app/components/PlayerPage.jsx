import React from 'react'
import { Loader } from 'semantic-ui-react'
import { firebaseConnect } from 'fire-connect'
import { formatGame } from '../utils'

import NameForm from './PlayerTempForm'


const PlayingGame = props => {
  const currentQuestion = props.game.currentQuestion
  const answered = props.user && props.responseQueue[props.user.uid]
  return (
    <>
      {currentQuestion && !answered ?
      // question reappears when answer is marked as incorrect
      <div onClick={props.answerQuestion} style={{ padding: '2em', cursor: 'pointer' }}>
        <h3>{currentQuestion.prompt}</h3>
      </div>
      :
      currentQuestion && answered ?
      <div>
        <h3>Submitted</h3>
      </div>
      :
      <div>
        <h2>Waiting for Question</h2>
        <p>When a question appears, tap it to buzz in</p>
      </div>
      }
    </>
  )
}

const PlayerSignedIn = props => {
  return props.game.started ?
    <PlayingGame {...props} />
    :
    <>
      <h2>Waiting for host to begin game</h2>
      <p>When a question appears, tap it to buzz in</p>
    </>
}

const JoinGame = props => {
  return (
    <>
      <h3>Welcome to Peril</h3>
      {/* disable if game has started */}
      <NameForm submit={props.joinGame} />
      <p>Join as Spectator (placeholder)</p>
    </>
  )
}

const PlayerPage = props => {
  if (!props.isLoaded) return <Loader active />
  if (props.error) return <div>{props.error.message}</div>
  const inGame = props.user && props.players[props.user.uid] && props.players[props.user.uid].active
  return (
    <div style={{ height: '75%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      {inGame ? <PlayerSignedIn {...props} /> : <JoinGame {...props} />}
    </div>
  )
}

function addListener(component, ref) {
  return ref(`games/${component.props.match.params.hostId}/client`).on('value', snapshot => {
    if (!snapshot.exists()) {
      component.setState({ error: { message: 'Game Not Found' }, isLoaded: true })
      return
    }
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

function addDispatchers(component, ref, host) {
  return {
    joinGame({ name }) {
      if (!component.state.game.started || component.state.game.latePlayersAllowed) {
        const user = host ? Promise.resolve(host) : component.props.auth.signInAnonymously()
        user.then(_user => {
          return ref(`games/${component.props.match.params.hostId}/client/players/${_user.uid}`).set({
            name,
            score: 0,
            active: true,
          })
        })
        .catch(err => console.error('Error:', err))
      } else {
        console.log(`can't join games in progress`)
      }
    },
    answerQuestion() {
      ref(`games/${component.props.match.params.hostId}/client/responseQueue/${component.props.user.uid}`).set(component.props.firebaseTimestamp)
      .catch(err => console.error('Error:', err))
    },
  }
}

export default firebaseConnect(addListener, addDispatchers)(PlayerPage)
