import { last, omit } from 'lodash'
import { observable, action, computed } from 'mobx'
import haversine from 'haversine'

import { updateXcodeLocation } from './settings.js'

class Stats {

  timeout = null

  @observable totalDistance = 0
  @observable lastLocation = null
  @observable lastMoves = []

  @computed get speed() {
    // we must have at least 2 points to get an average speed
    if (this.lastMoves.length < 2) return 0

    // last moves ranges to get an average speed, distance in km
    const lastMovesDistance = this.lastMoves.reduce((total, curr, idx) => {
      if (idx > 0) {
        const stepDistance = haversine(this.lastMoves[idx - 1], curr)
        return total + stepDistance
      } else {
        return total
      }
    }, 0)

    const [ { timestamp: startTime } ] = this.lastMoves
    const { timestamp: endTime } = last(this.lastMoves)
    const lastMovesTime = ((endTime - startTime) / (1000 * 60 * 60)) // in hours

    return lastMovesDistance / lastMovesTime
  }

  @action pushMove = (latitude, longitude) => {
    // dont reset `this.lastMoves` we have received a new location
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }

    const move = { latitude, longitude, timestamp: +new Date() }

    if (this.lastLocation && updateXcodeLocation.get()) {
      this.totalDistance = this.totalDistance + haversine(this.lastLocation, move)
    }

    this.lastLocation = omit(move, 'timestamp')
    this.lastMoves.push(move)

    // stop speed count after 2,5s
    // new location should be pushed every second, after it means user stopped
    this.timeout = setTimeout(this.clearMoves, 2500)
  }

  @action clearMoves = () => {
    this.lastMoves.clear()
  }

}

export default new Stats()
