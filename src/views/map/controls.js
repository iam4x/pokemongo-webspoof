import { defer, random, after } from 'lodash'
import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import cx from 'classnames'

import userLocation from '../../models/user-location.js'
import settings from '../../models/settings.js'

// HACK DIRECTLY TO MODEL
import autopilot from '../../models/autopilot.js'


const lastMoveDirection = observable(null)

const handleMove = action((direction) => {
  const speedCoeff = settings.speedLimit.get()
  const move = (direction === 'UP' || direction === 'DOWN') ?
    random(0.0000300, 0.000070, true) / speedCoeff :
    random(0.0000700, 0.000070, true) / speedCoeff

  let newLocation
  switch (direction) {
  case 'LEFT': { newLocation = [ userLocation[0], userLocation[1] - move ]; break }
  case 'RIGHT': { newLocation = [ userLocation[0], userLocation[1] + move ]; break }
  case 'DOWN': { newLocation = [ userLocation[0] - move, userLocation[1] ]; break }
  case 'UP': { newLocation = [ userLocation[0] + move, userLocation[1] ]; break }
  default: { newLocation = [ userLocation[0], userLocation[1] ] }
  }

  userLocation.replace(newLocation)

  // we set `lastMoveDirection` to `null` for react re-render without class `.last`
  lastMoveDirection.set(null)
  defer(action(() => lastMoveDirection.set(direction)))
})

var last_escape = 0;
const handleEscape = after(2, () => {
  if (Date.now() - last_escape <= 500) {
    autopilot.stop()
    last_escape = 0;
  } else {
    last_escape = Date.now();  
  }
})

window.addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
  case 65:
  case 81:
  case 37: { return handleMove('LEFT') }
  case 87:
  case 90:
  case 38: { return handleMove('UP') }
  case 68:
  case 39: { return handleMove('RIGHT') }
  case 83:
  case 40: { return handleMove('DOWN') }
  case 27: { return handleEscape() }
  default: return undefined
  }
})

const Controls = observer(() =>
  <div className='controls'>
    { [ 'UP', 'DOWN', 'LEFT', 'RIGHT' ].map(direction =>
      <span
        key={ direction }
        onClick={ () => handleMove(direction) }
        className={ cx(
          `octicon octicon-arrow-${direction.toLowerCase()}`,
          { last: lastMoveDirection.get() === direction }
        ) } />
    ) }
  </div>
)

export default Controls
