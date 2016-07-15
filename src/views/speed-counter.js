import React from 'react'
import { observer } from 'mobx-react'

import speed from '../models/speed.js'

const SpeedCounter = observer(() =>
  <span className='speed'>
    { speed.get().toFixed() } km/h
  </span>
)

export default SpeedCounter
