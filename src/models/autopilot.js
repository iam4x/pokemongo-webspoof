import { times } from 'lodash'
import { action, observable, computed } from 'mobx'
import haversine from 'haversine'
import Alert from 'react-s-alert'
import userLocation from './user-location.js'

class Autopilot {

  timeout = null // inner setTimout to move next location
  @observable paused = false
  @observable running = false // is the autopilot running
  @observable steps = []
  @observable speed = 9 / 3600 // 0.0025 ~= 2,5m/s ~= 9 km/h
  @observable distance = 0 // remaining distance to arrival in km
  @observable rawOverviewPath = null // save last query to re-calculate optimized route
  @observable destination = { lat: null, lng: null };

  @computed get accurateSteps() {
    if (this.rawOverviewPath) {
      const { steps } = this.calculateIntermediateSteps(this.rawOverviewPath)
      return steps
    } else {
      return []
    }
  }

  @computed get clean() {
    return !this.running && !this.paused
  }

  @computed get time() {
    const speed = this.speed * 3600 // to km/h
    const hours = Math.floor(this.distance / speed)
    const minutes = Math.floor(((this.distance / speed) * 60) % 60)

    if (isNaN(hours) || isNaN(minutes)) {
      return '0 minutes'
    }

    if (hours >= 1) {
      return `${hours}h ${minutes} minutes`
    } else {
      return `${minutes} minutes`
    }
  }

  findDirectionPath = (lat, lng) => new Promise((resolve, reject) => {
    const { google: { maps } } = window
    this.destination = { lat, lng }

    // prepare `directionsRequest` to google map
    const directionsService = new maps.DirectionsService()
    const directionsRequest = {
      origin: { lat: userLocation[0], lng: userLocation[1] },
      destination: this.destination,
      travelMode: maps.TravelMode.WALKING,
      unitSystem: maps.UnitSystem.METRIC
    }

    // ask google map to find a route
    directionsService.route(directionsRequest, (response, status) => {
      if (status === maps.DirectionsStatus.OK) {
        const { routes: [ { overview_path } ] } = response
        this.rawOverviewPath = overview_path
        return resolve(overview_path)
      }
      this.rawOverviewPath = null
      return reject(status)
    })
  })

  calculateIntermediateSteps = (foundPath) =>
    foundPath.reduce(
      (result, { lat: endLat, lng: endLng }, idx) => {
        if (idx > 0) {
          const { lat: startLat, lng: startLng } = foundPath[idx - 1]
          const pendingDistance = haversine(
            { latitude: startLat(), longitude: startLng() },
            { latitude: endLat(), longitude: endLng() }
          )

          if (isNaN(this.speed)) {
            return {
              distance: result.distance + pendingDistance,
              steps: [ { lat: endLat(), lng: endLng() } ]
            }
          }

          // 0.0025 ~= 2,5m/s ~= 9 km/h
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
    try {
      const foundPath = await this.findDirectionPath(lat, lng)
      const { distance } = this.calculateIntermediateSteps(foundPath)

      this.distance = distance
    } catch (error) {
      Alert.error(`
        <strong>Error with schedule trip</strong>
        <div class='stack'>${error}</div>
      `)
      throw error
    }
  }

  // move every second to next location into `this.steps`
  start = () => {
    this.running = true
    this.paused = false

    const moveNextPoint = action(() => {
      if (this.steps.length !== -1) {
        const [ { lat: nextLat, lng: nextLng } ] = this.steps

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

  @action pause = () => {
    clearTimeout(this.timeout)
    this.timeout = null
    this.running = false
    this.paused = true
  }

  // reset all store state
  @action stop = () => {
    clearTimeout(this.timeout)
    this.timeout = null
    this.paused = false
    this.running = false
    this.distance = 0
    this.steps.clear()
  }
}

export default new Autopilot()
