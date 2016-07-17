import { defer } from 'lodash'

import React, { Component } from 'react'
import GoogleMap from 'google-map-react'
import { observable, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import userLocation from '../../models/user-location.js'
import settings from '../../models/settings.js'

import GoToPlace from './go-to-place.js'
import SpeedCounter from './speed-counter.js'
import BooleanSettings from './boolean-settings.js'
import Coordinates from './coordinates.js'
import SpeedLimit from './speed-limit.js'
import Controls from './controls.js'
import TotalDistance from './total-distance.js'
import Autopilot from './autopilot.js'
import Pokeball from './pokeball.js'

const isLoading = observable(true)

@observer
class Map extends Component {

  componentWillMount() {
    // get user geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleGeolocationSuccess,
        (error) => console.warn(error),
        { enableHighAccuracy: true, maximumAge: 0 }
      )
    }
  }

  @action handleGeolocationSuccess({ coords: { latitude, longitude } }) {
    userLocation.replace([ latitude, longitude ])
  }

  @action handleDragMap = ({ zoom: newZoom }) => {
    if (newZoom !== settings.zoom.get()) {
      settings.zoom.set(newZoom)

      // reset zoom if it has been changed by loading `pokemontSpots.kml`
      if (isLoading.get() && newZoom === 3) {
        defer(() => {
          settings.zoom.set(17)
          isLoading.set(false)
        })
      }
    }
  }

  /* eslint max-len: 0 */
  /* eslint no-new: 0 */
  @action handleGoogleMapLoaded = (({ map }) => {
    const lastLocation = toJS(userLocation)

    // load pokemon spots map
    isLoading.set(true)
    const { KmlLayer } = window.google.maps
    const url = 'https://gist.githubusercontent.com/iam4x/95e6ab058f1b6dd4fe696d597c2c7e1e/raw/0d2a7356345eccd4e7d397ff535de3ec004ca293/pokemonSpots.kml'
    new KmlLayer({ url, map })

    userLocation.replace(lastLocation)
  })

  render() {
    return (
      <div className='google-map-container'>
        <GoogleMap
          ref='map'
          zoom={ settings.zoom.get() }
          center={ toJS(userLocation) }
          onChange={ this.handleDragMap }
          options={ () => ({ keyboardShortcuts: false }) }
          onGoogleApiLoaded={ this.handleGoogleMapLoaded }
          yesIWantToUseGoogleMapApiInternals={ true }>
          <Pokeball lat={ userLocation[0] } lng={ userLocation[1] } />
        </GoogleMap>

        { /* controls, settings displayed on top of the map */ }
        <Coordinates />
        <GoToPlace />
        <SpeedCounter />
        <SpeedLimit />
        <BooleanSettings />
        <Controls />
        <TotalDistance />
        <Autopilot />
      </div>
    )
  }
}
export default Map
