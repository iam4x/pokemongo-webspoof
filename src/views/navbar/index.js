import React from 'react'

import ServerStatus from './server-status.js'
import PokevisionStatus from './pokevision-status.js'
import UserLocationName from './user-location-name.js'
import GithubStar from './github-star.js'

const Navbar = () =>
  <div className='navbar clearfix'>
    <ServerStatus />
    <PokevisionStatus />
    <UserLocationName />
    <GithubStar />
  </div>

export default Navbar
