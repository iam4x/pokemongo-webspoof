import React from 'react'
import { observer } from 'mobx-react'

import userLocatioName from '../../models/user-location-name.js'

const UserLocationName = observer(() =>
  <div className='user-location-name block'>
    <div className='title'>Current location name</div>
    <span className='tag tag-info'>{ userLocatioName.get() }</span>
  </div>
)

export default UserLocationName
