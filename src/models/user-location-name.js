import { throttle } from 'lodash'
import { observable } from 'mobx'
import Alert from 'react-s-alert'

import userLocation from './user-location.js'

const geocoder = window.require('geocoder')
const userLocatioName = observable('Unknown')

const reverseLocation = throttle(([ lat, lng ]) => {
  if (lat && lng) {
    geocoder.reverseGeocode(lat, lng, (err, data) => {
      if (err) {
        Alert.error(`
          <strong>Error while reverse location</strong>
          <div class='stack'>${err}</div>
        `)

        return console.warn(err)
      }

      const { results: [ location ] } = data
      if (location) userLocatioName.set(location.formatted_address)
    })
  }
}, 5000)

userLocation.observe(() => reverseLocation(userLocation))

export default userLocatioName
