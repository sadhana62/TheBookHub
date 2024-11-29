import React from 'react'
import Banner from './Banner'
import BestSellers from './BestSeller'
import Recommened from './Recommanded'
import News from './News'

const Home = () => {
  return (
    <div>
      <Banner/>
      <BestSellers/>
      <Recommened/>
      <News/>
    </div>
  )
}

export default Home
