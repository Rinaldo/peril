import React from 'react'

import MyGames from './MyGames'

const Home = props => {
  // console.log('home props', props)
  return (
  <div>
    <MyGames history={props.history} />
    {/* <TopGames />
    <MyQuestions />
    <TopQuestions /> */}
  </div>
  )
}

export default Home
