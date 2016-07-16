import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'

import userLocation from '../../models/user-location.js'

const handleChange = (idx) => action(({ target: { value } }) => {
  userLocation[idx] = parseFloat(value)
})

const Coordinates = observer(() =>
  <div className='clearfix coordinates'>
    { [ 'lat', 'lng' ].map((direction, idx) =>
      <div key={ idx } className='pull-xs-left'>
        <div className='input-group'>
          <span className='input-group-addon' id='basic-addon1'>
            { direction }
          </span>
          <input
            type='text'
            className='form-control'
            placeholder={ direction }
            aria-describedby='basic-addon1'
            value={ userLocation[idx] }
            onChange={ handleChange(idx) } />
        </div>
      </div>
    ) }
  </div>
)

export default Coordinates
