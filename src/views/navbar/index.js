import React from 'react'

import UserLocationName from './user-location-name.js'
import GithubStar from './github-star.js'

const Navbar = () =>
  <div className='navbar clearfix'>
    <UserLocationName />
    <GithubStar />
  </div>

export default Navbar
