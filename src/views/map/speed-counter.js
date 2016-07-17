import React from 'react'
import { observer } from 'mobx-react'

import { speed } from '../../models/stats.js'

const SpeedCounter = observer(() =>
  <span className='speed'>
    { speed.toFixed(1) } km/h
  </span>
)

export default SpeedCounter
