import React from 'react'
import { Loader } from 'semantic-ui-react'
import { firebaseConnect } from '../fire-connect'
import { formatGame } from '../utils'

import NameForm from './PlayerTempForm'


const PlayingGame = props => {
  const currentQuestion = props.game.currentQuestion
  const answered = props.user && props.responseQueue[props.user.uid]
  return (
    <React.Fragment>
      {currentQuestion && !answered ?
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
    </React.Fragment>
  )
}

const PlayerSignedIn = props => {
  return props.game.started ?
    <PlayingGame {...props} />
    :
    <React.Fragment>
      <h2>Waiting for host to begin game</h2>
      <p>When a question appears, tap it to buzz in</p>
    </React.Fragment>
}

const JoinGame = props => {
  return (
    <React.Fragment>
      <h3>Welcome to Peril</h3>
      <NameForm submit={props.joinGame} />
      <p>Join as Spectator (placeholder)</p>
    </React.Fragment>
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
  }
}

export default firebaseConnect(addListener, addDispatchers)(PlayerPage)
