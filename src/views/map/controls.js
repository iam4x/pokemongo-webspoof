import { defer, random } from 'lodash'
import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import cx from 'classnames'

import userLocation from '../../models/user-location.js'
import lastMoves from '../../models/last-moves.js'
import settings from '../../models/settings.js'

const lastMoveDirection = observable(null)

const pushLastMoves = (newLocation) => {
  const start = { latitude: userLocation[0], longitude: userLocation[1] }
  const end = { latitude: newLocation[0], longitude: newLocation[1] }

  const lastMove = { start, end, timestamp: +new Date() }
  lastMoves.push(lastMove)

  // remove lastMove after 2 seconds
  setTimeout(() => lastMoves.remove(lastMove), 2000)
}

const handleMove = action((direction) => {
  const speedCoeff = settings.speedLimit.get()
  const move = (direction === 'UP' || direction === 'DOWN') ?
    random(0.0000300, 0.000070, true) / speedCoeff :
    random(0.0000700, 0.000070, true) / speedCoeff

  const jitter = settings.addJitterToMoves.get() ? random(-0.000009, 0.000009, true) : 0

  let newLocation
  switch (direction) {
  case 'LEFT': { newLocation = [ userLocation[0] + jitter, userLocation[1] - move ]; break }
  case 'RIGHT': { newLocation = [ userLocation[0] + jitter, userLocation[1] + move ]; break }
  case 'DOWN': { newLocation = [ userLocation[0] - move, userLocation[1] + jitter ]; break }
  case 'UP': { newLocation = [ userLocation[0] + move, userLocation[1] + jitter ]; break }
  default: { newLocation = [ userLocation[0] + jitter, userLocation[1] + jitter ] }
  }

  pushLastMoves(newLocation)
  userLocation.replace(newLocation)

  // we set `lastMoveDirection` to `null` for react re-render without class `.last`
  lastMoveDirection.set(null)
  defer(action(() => lastMoveDirection.set(direction)))
})

window.addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
  case 37: { return handleMove('LEFT') }
  case 38: { return handleMove('UP') }
  case 39: { return handleMove('RIGHT') }
  case 40: { return handleMove('DOWN') }
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
