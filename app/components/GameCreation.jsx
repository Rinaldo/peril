import React, { Component } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { fireConnect, rt } from '../firebase'

import GameInfoEdit from './GameInfoEdit'
import QuestionList from './QuestionList'
import SubHeader from './SubHeader'

/* eslint-disable react/prefer-stateless-function */
// react-dnd requires DragDropContext to be passed a stateful function
class GameCreation extends Component {

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
  return component.gameRef.onSnapshot(doc => {
    if (doc.exists) {
      // console.log('doc', doc)
      component.setState({ game: { ...doc.data(), docId: doc.id}, isLoaded: true })
    } else {
      console.error('Error: document does not exist')
    }
  })
}

function addDispatchers(component, db) {
  component.gameRef = db
    .collection('gameTemplates')
    .doc(component.props.match.params.gameId)
  return {
    createGameInstance() {
      component.gameRef.collection('gameInfo').doc('info').get()
      .then(doc => doc.data())
      .then(gameInfo => {
        rt.ref(`games/${component.state.game.docId}`).set({
          ...component.state.game,
          gameInfo,
        })
        .then(() => component.props.history.push(`/games/${component.state.game.docId}/host`))
        .then(() => console.log('created successfully'))
      })
      .catch(err => console.error('Error:', err))
    }
  }
}

export default fireConnect(addListener, addDispatchers)(DragDropContext(HTML5Backend)(GameCreation))
