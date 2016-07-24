import React from 'react'
import { observer } from 'mobx-react'

import { serverStatus, isLoading } from '../../models/pokemon-location.js'

const handleStatusClick = () =>
  window.open('https://pokevision.com')

const PokevisionStatus = observer(() =>
  <div
    className='block server-status'
    onClick={ handleStatusClick }>
    <div className='title'>Pokévision</div>

    <div className='clearfix'>
      { /* status in color */ }
      <div className='pull-xs-left'>
        <span className={ `tag tag-${serverStatus[1]}` }>
          { serverStatus[0].toUpperCase() }
        </span>
      </div>

      { /* loading spinner when refreshing */ }
      <div className='pull-xs-right'>
        { isLoading.get() ?
          <i className='fa fa-refresh fa-spin' /> :
          <noscript /> }
      </div>
    </div>
  </div>
)

export default PokevisionStatus