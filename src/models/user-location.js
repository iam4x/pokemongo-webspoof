/* eslint max-len: 0 */
import { random, throttle } from 'lodash'
import { observable } from 'mobx'
import Alert from 'react-s-alert'
import settings from './settings.js'
import stats from './stats.js'

// electron specific import
const { writeFile } = window.require('fs')
const { resolve } = window.require('path')
const { exec } = window.require('child_process')
const { remote } = window.require('electron')

const userLocation = observable([ 0, 0 ])
const isValidLocation = /^([-+]?\d{1,2}([.]\d+)?),\s*([-+]?\d{1,3}([.]\d+)?)$/
const validateCoordinates = ((change) => {
  // check that we have valid coordinates before update
  if (change.type === 'splice') {
    const { added: [ lat, lng ] } = change
    const isValid = isValidLocation.test(`${lat}, ${lng}`)
    if (isValid) {
      return change
    } else {
      Alert.warning(`
        <strong>Invalid coordinates received</strong>
        <div class='stack'>{ lat: ${lat}, lng: ${lng} }</div>
      `)
      throw new Error(`Invalid coordinates ${lat}, ${lng}`)
    }
  }
  return change
})

const updateXcodeLocation = throttle(([ lat, lng ]) => {
  // track location changes for total distance & average speed
  stats.pushMove(lat, lng)

  const jitter = settings.addJitterToMoves.get() ? random(-0.000009, 0.000009, true) : 0
  const xcodeLocationData =
    `<gpx creator="Xcode" version="1.1"><wpt lat="${(lat + jitter).toFixed(6)}" lon="${(lng + jitter).toFixed(6)}"><name>PokemonLocation</name></wpt></gpx>`

  // write `pokemonLocation.gpx` file fro xcode spoof location
  const filePath = resolve(remote.getGlobal('tmpProjectPath'), 'pokemonLocation.gpx')
  writeFile(filePath, xcodeLocationData, async (error) => {
    if (error) {
      Alert.error(`
        <strong>Error writting 'pokemonLocation.gpx' to file</strong>
        <div class='stack'>${error.message}</div>
        <div class='stack'>${error.stack}</div>
      `)
      return console.warn(error)
    }

    if (settings.updateXcodeLocation.get()) {
      // reload location into xcode
      const scriptPath = resolve(window.__dirname, 'autoclick.applescript')
      exec(`osascript ${scriptPath}`, (autoclickErr, stdout, stderr) => {
        if (stderr) {
          Alert.error(`
            <strong>Error autoclick Xcode - Code 2</strong>
            <div class='stack'>${stderr}</div>
          `)
          return console.warn(stderr)
        }
      })
    }
  })
}, 1000)

userLocation.intercept(validateCoordinates)

// after update
userLocation.observe(() => updateXcodeLocation(userLocation))

// updated at random intervals to prevent reversion
let currentTimer = null
function scheduleUpdate() {
  const randomWait = random(1000, 10000, true)
  if (!settings.stationaryUpdates.get()) {
    if (currentTimer) {
      window.clearTimeout(currentTimer)
      currentTimer = null
    }
    return
  }

  currentTimer = window.setTimeout(() => {
    currentTimer = null

    if (!settings.stationaryUpdates.get()) {
      return
    }

    updateXcodeLocation(userLocation)
    scheduleUpdate()
  }, randomWait)
}

// watch settings for updates
settings.stationaryUpdates.observe(() => scheduleUpdate())

// initial trigger
scheduleUpdate()

export default userLocation
