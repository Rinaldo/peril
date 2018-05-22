import React from 'react'
import { Button } from 'semantic-ui-react'
import { firebaseConnect } from '../fire-connect'
import { formatGame } from '../utils'

import NameForm from './PlayerTempForm'

const PlayerPage = props => {
  console.log(props)
  return (
    <div>
      <Button onClick={props.test}>test</Button>
      <Button onClick={props.logOut}>Log out</Button>
      {!props.user && <NameForm submit={props.joinGame} />}
    </div>
  )
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
        })
      })
      .catch(err => console.error('Error:', err))
    },
    logOut() {
      component.props.auth.signOut()
    },
    test() {
      ref(`games/${component.props.match.params.hostId}/client/players`).push({
        name: 'testing',
        score: 0,
      })
    }
  }
}

export default firebaseConnect(addListener, addDispatchers)(PlayerPage)
