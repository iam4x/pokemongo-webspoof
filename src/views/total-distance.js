import React from 'react'
import { observer } from 'mobx-react'

import totalDistance from '../models/total-distance.js'

const TotalDistance = observer(() =>
  <div className='total-distance'>
    { totalDistance.get().toFixed(2) } km
  </div>
)

export default TotalDistance
