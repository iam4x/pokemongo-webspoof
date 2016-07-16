import React from 'react'
import Alert from 'react-s-alert'

import Map from './views/map'

const App = () =>
  <div className='app'>
    <Map />

    { /* app wide alerts */ }
    <Alert
      timeout='none'
      position='bottom-right'
      stack={ { limit: 3 } }
      html={ true } />
  </div>

export default App
