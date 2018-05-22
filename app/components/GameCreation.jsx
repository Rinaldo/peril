import React, { Component } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { firestoreConnect } from '../fire-connect'
import { stripData } from '../utils'

import GameInfoEdit from './GameInfoEdit'
import QuestionList from './QuestionList'
import SubHeader from './SubHeader'

/* eslint-disable react/prefer-stateless-function */
// react-dnd requires DragDropContext to be passed a stateful function
class GameCreation extends Component {
  // constructor(props) {
  //   super(props)
  //   this.hostGame = this.hostGame.bind(this)
  // }

  // hostGame() {
  //   this.props.history.push('/host')
  // }

  render() {
    // console.log('gameId:', this.props.game && this.props.game.docId)
    return (
      <React.Fragment>
        <SubHeader game={this.props.game} createGameInstance={this.props.createGameInstance} />
        <div className="game-creation">
          <GameInfoEdit gameId={this.props.match.params.gameId} />
          <QuestionList />
        </div>
      </React.Fragment>
    )
  }
}

function addListener(component) {
  // gameRef defined in addDispatchers
  return component.gameRef.onSnapshot(doc => {
    if (doc.exists) {
      // console.log('doc', doc)
      component.setState({ game: { ...doc.data(), docId: doc.id}, isLoaded: true })
    } else {
      console.error('Error: document does not exist')
    }
  })
}

function addDispatchers(component, db, user) {
  component.gameRef = db
    .collection('gameTemplates')
    .doc(component.props.match.params.gameId)
  return {
    createGameInstance() {
      component.gameRef.collection('gameInfo').doc('info').get()
      .then(doc => doc.data())
      .then(gameInfo => {
        component.props.firebase.ref(`games/${user.uid}`).set({
          client: { ...component.state.game, gameInfo: stripData(gameInfo) },
          host: { gameInfo },
        })
        .then(() => component.props.history.push('/host'))
        .then(() => console.log('created successfully'))
      })
      .catch(err => console.error('Error:', err))
    }
  }
}

export default firestoreConnect(addListener, addDispatchers)(DragDropContext(HTML5Backend)(GameCreation))
