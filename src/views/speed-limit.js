import React from 'react'
import { observer } from 'mobx-react'
import cx from 'classnames'

import { speedLimit } from '../models/settings.js'

const presets = [ [ '50-30', 2 ], [ '30-20', 3 ], [ '20-10', 4 ] ]

const SpeedLimit = observer(() =>
  <div className='speed-limit btn-group btn-group-sm'>
    { presets.map(([ limit, coeff ], idx) =>
      <button
        key={ idx }
        type='button'
        onClick={ () => speedLimit.set(coeff) }
        className={ cx('btn', {
          'btn-primary': coeff === speedLimit.get(),
          'btn-secondary': coeff !== speedLimit.get()
        }) }>
        ~{ limit } km/h
      </button>
    ) }
  </div>
)

export default SpeedLimit
