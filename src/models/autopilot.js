import { times } from 'lodash'
import { action, observable, computed } from 'mobx'
import haversine from 'haversine'

import userLocation from './user-location.js'
import { pushMove } from './last-moves.js'

class Autopilot {

  timeout = null // inner setTimout to move next location

  @observable running = false // is the autopilot running
  @observable steps = [] // coordinate steps to go to destination
  @observable speed = 0.003 // 0.003 ~= 3m/s ~= 12 km/h
  @observable distance = 0 // remaining distance to arrival in km

  @computed get time() {
    const hours = Math.floor(this.distance / 12)
    const minutes = Math.floor(((this.distance / 12) * 60) % 60)

    if (hours >= 1) {
      return `${hours}h ${minutes} minutes`
    } else {
      return `${minutes} minutes`
    }
  }

  findDirectionPath = (lat, lng) => new Promise((resolve, reject) => {
    const { google: { maps } } = window

    // prepare `directionsRequest` to google map
    const directionsService = new maps.DirectionsService()
    const directionsRequest = {
      origin: { lat: userLocation[0], lng: userLocation[1] },
      destination: { lat, lng },
      travelMode: maps.TravelMode.WALKING,
      unitSystem: maps.UnitSystem.METRIC
    }

    // ask google map to find a route
    directionsService.route(directionsRequest, (response, status) => {
      if (status === maps.DirectionsStatus.OK) {
        const { routes: [ { overview_path } ] } = response
        return resolve(overview_path)
      }

      return reject(status)
    })
  })

  calculateIntermediateSteps = (foundPath) => foundPath.reduce(
    (result, { lat: endLat, lng: endLng }, idx) => {
      if (idx > 0) {
        const { lat: startLat, lng: startLng } = foundPath[idx - 1]

        const pendingDistance = haversine(
          { latitude: startLat(), longitude: startLng() },
          { latitude: endLat(), longitude: endLng() }
        )

        // 0.003 ~= 3m/s ~= 12 km/h
        const splitInto = (pendingDistance / this.speed).toFixed()

        const latSteps = (Math.abs(startLat() - endLat())) / splitInto
        const lngSteps = (Math.abs(startLng() - endLng())) / splitInto

        const stepsInBetween = times(splitInto, (step) => {
          const calculatedLat = (startLat() > endLat()) ?
            startLat() - (latSteps * step) : startLat() + (latSteps * step)
          const calculatedLng = (startLng() > endLng()) ?
            startLng() - (lngSteps * step) : startLng() + (lngSteps * step)

          return { lat: calculatedLat, lng: calculatedLng }
        })

        return {
          distance: result.distance + pendingDistance,
          steps: [ ...result.steps, ...stepsInBetween ]
        }
      }
      return result
    },
    { distance: 0, steps: [] }
  )

  @action scheduleTrip = async (lat, lng) => {
    const foundPath = await this.findDirectionPath(lat, lng)
    const { distance, steps } = this.calculateIntermediateSteps(foundPath)

    this.steps.replace(steps)
    this.distance = distance
  }

  // move every second to next location into `this.steps`
  start = () => {
    this.running = true

    const moveNextPoint = action(() => {
      if (this.steps.length !== -1) {
        const [ { lat: nextLat, lng: nextLng } ] = this.steps
        pushMove([ nextLat, nextLng ], 3500)
        // move to locaiton
        userLocation.replace([ nextLat, nextLng ])
        // remove first location that we moved to
        this.steps.remove(this.steps[0])

        // move on to the next location
        if (this.steps.length !== 0) {
          this.timeout = setTimeout(moveNextPoint, 1000)
        } else {
          this.stop()
        }
      }
    })

    moveNextPoint()
  }

  // reset all store state
  @action stop = () => {
    clearTimeout(this.timeout)
    this.timeout = null
    this.running = false
    this.distance = 0
    this.steps.clear()
  }

}

export default new Autopilot()
