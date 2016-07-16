import React from 'react'
import { observer } from 'mobx-react'
import cx from 'classnames'

import { addJitterToMoves, updateXcodeLocation } from '../../models/settings.js'

const settings = [
  [ addJitterToMoves, 'Add randomness to moves' ],
  [ updateXcodeLocation, 'Auto update Xcode location' ]
]

const BooleanSettings = observer(() =>
  <div className='boolean-settings'>
    { settings.map(([ setting, label ], idx) =>
      <div
        key={ idx }
        onClick={ () => setting.set(!setting.get()) }
        className={ cx('btn btn-sm', {
          'btn-primary': setting.get(),
          'btn-secondary': !setting.get()
        }) }>
        { label }
      </div>
    ) }
  </div>
)

export default BooleanSettings
