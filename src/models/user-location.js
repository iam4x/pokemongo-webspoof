/* eslint max-len: 0 */
import { throttle } from 'lodash'
import { observable } from 'mobx'
import Alert from 'react-s-alert'

import settings from './settings.js'

// electron specific import
const { writeFile } = window.require('fs')
const { resolve } = window.require('path')
const { exec } = window.require('child_process')

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
  const xcodeLocationData =
    `<gpx creator="Xcode" version="1.1"><wpt lat="${lat}" lon="${lng}"><name>PokemonLocation</name></wpt></gpx>`

  if (settings.updateXcodeLocation.get()) {
    // write `pokemonLocation.gpx` file fro xcode spoof location
    const filePath = resolve(window.__dirname, 'pokemonLocation.gpx')
    writeFile(filePath, xcodeLocationData, async (error) => {
      if (error) {
        Alert.error(`
          <strong>Error writting 'pokemonLocation.gpx' to file</strong>
          <div class='stack'>${error.message}</div>
          <div class='stack'>${error.stack}</div>
        `)

        return console.warn(error)
      }

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
    })
  }
}, 1000)

userLocation.intercept(validateCoordinates)

// after update
userLocation.observe(() => updateXcodeLocation(userLocation))

export default userLocation
