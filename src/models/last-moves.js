import { last } from 'lodash'
import { action, observable } from 'mobx'
import haversine from 'haversine'

import speed from './speed.js'
import totalDistance from './total-distance.js'
import userLocation from './user-location.js'

// haversine() seems to returns bigger than expected
const MAGIC_NUMBER = 1.8

const lastMoves = observable([])

const pushMove = action(([ endLat, endLng ], removeAfter = 2000) => {
  const [ startLat, startLng ] = userLocation

  const start = { latitude: startLat, longitude: startLng }
  const end = { latitude: endLat, longitude: endLng }

  const move = { start, end, timestamp: +new Date() }
  lastMoves.push(move)

  setTimeout(() => lastMoves.remove(move), removeAfter)
})

const calcUserSpeed = () => {
  if (lastMoves.length > 1) {
    const rangeDistance = haversine(lastMoves[0].start, last(lastMoves).end) / MAGIC_NUMBER
    const totalTime = last(lastMoves).timestamp - lastMoves[0].timestamp

    const hours = (totalTime / (1000 * 60 * 60)) % 24
    return rangeDistance / hours
  } else {
    return 0
  }
}

const calcNewDistance = () => {
  if (lastMoves.length > 0) {
    const lastDistance = last(lastMoves)
    return haversine(lastDistance.start, lastDistance.end) / MAGIC_NUMBER
  } else {
    return 0
  }
}

lastMoves.observe(() => {
  speed.set(calcUserSpeed())
  totalDistance.set(totalDistance.get() + calcNewDistance())
})

export default { lastMoves, pushMove }
