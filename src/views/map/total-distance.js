import React from 'react'
import { observer } from 'mobx-react'

import { totalDistance } from '../../models/stats.js'

const TotalDistance = observer(() =>
  <div className='total-distance'>
    { totalDistance.toFixed(2) } km
  </div>
)

export default TotalDistance
