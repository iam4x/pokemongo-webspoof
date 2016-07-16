import React from 'react'

import ServerStatus from './server-status.js'
import GithubStar from './github-star.js'

const Navbar = () =>
  <div className='navbar clearfix'>
    <ServerStatus />
    <GithubStar />
  </div>

export default Navbar
