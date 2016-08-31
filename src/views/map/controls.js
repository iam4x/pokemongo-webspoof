import { defer, random } from 'lodash'
import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import cx from 'classnames'

import userLocation from '../../models/user-location.js'
import settings from '../../models/settings.js'

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
  case 'UP-LEFT': { newLocation = [ userLocation[0] + move, userLocation[1] - move ]; break }
  case 'UP-RIGHT': { newLocation = [ userLocation[0] + move, userLocation[1] + move ]; break }
  case 'DOWN-LEFT': { newLocation = [ userLocation[0] - move, userLocation[1] - move ]; break }
  case 'DOWN-RIGHT': { newLocation = [ userLocation[0] - move, userLocation[1] + move ]; break }
  default: { newLocation = [ userLocation[0], userLocation[1] ] }
  }

  userLocation.replace(newLocation)

  // we set `lastMoveDirection` to `null` for react re-render without class `.last`
  lastMoveDirection.set(null)
  defer(action(() => lastMoveDirection.set(direction)))
})

window.addEventListener('keydown', ({ keyCode }) => {
  const lastDirection = lastMoveDirection.get();

  switch (keyCode) {
  case 65:
  case 81:
  case 37: {
    if (lastDirection === 'UP' || lastDirection === 'DOWN') {
      return handleMove(lastDirection + '-LEFT');
    }

    if (lastDirection === 'UP-LEFT' || lastDirection === 'UP-RIGHT') {
      return handleMove(lastDirection);
    }

    return handleMove('LEFT') }
  case 87:
  case 90:
  case 38: { 
    if (lastDirection === 'LEFT' || lastDirection === 'RIGHT') {
      return handleMove('UP-' + lastDirection);
    }

    if (lastDirection === 'UP-LEFT' || lastDirection === 'UP-RIGHT') {
      return handleMove(lastDirection);
    }
  
    return handleMove('UP') 
  }
  case 68:
  case 39: {
    if (lastDirection === 'UP' || lastDirection === 'DOWN') {
      return handleMove(lastDirection + '-RIGHT');
    }

    if (lastDirection === 'UP-RIGHT' || lastDirection === 'DOWN-RIGHT') {
      return handleMove(lastDirection);
    }

    return handleMove('RIGHT') }
  case 83:
  case 40: {
    if (lastDirection === 'LEFT' || lastDirection === 'RIGHT') {
      return handleMove('DOWN-' + lastDirection);
    }

    if (lastDirection === 'DOWN-LEFT' || lastDirection === 'DOWN-RIGHT') {
      return handleMove(lastDirection);
    }

    return handleMove('DOWN') }
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
