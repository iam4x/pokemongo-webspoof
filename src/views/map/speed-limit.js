import React from 'react'
import { observer } from 'mobx-react'
import cx from 'classnames'

import { speedLimit } from '../../models/settings.js'

const presets = [ [ '6-3', 2 ], [ '3-2', 3 ], [ '2-1', 4 ] ]

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
        ~{ limit } meter/step
      </button>
    ) }
  </div>
)

export default SpeedLimit
