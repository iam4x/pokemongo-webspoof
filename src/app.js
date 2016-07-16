import React from 'react'
import Alert from 'react-s-alert'

import Map from './views/map'
import Navbar from './views/navbar'

const App = () =>
  <div className='app'>
    <div className='clearfix'>
      <Navbar />
      <Map />
    </div>

    { /* app wide alerts */ }
    <Alert
      timeout='none'
      position='bottom-right'
      stack={ { limit: 3 } }
      html={ true } />
  </div>

export default App
