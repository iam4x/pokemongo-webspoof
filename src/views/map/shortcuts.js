import React from 'react'
import { observer } from 'mobx-react'
import cx from 'classnames'

import autopilot from '../../models/autopilot.js'

// import { addJitterToMoves, stationaryUpdates, updateXcodeLocation } from '../../models/settings.js'

const shortcuts = [
  [ 'Home', {lat: 37.749132, long: -122.428023}],
  [ 'Pier 39', {lat: 37.811159, long: -122.410799}],
  [ 'Wharf', {lat: 37.810890, long: -122.418927}],
  [ 'Ferry Building', {lat: 37.795349, long: -122.392167}],
  [ 'Union Square', {lat: 37.788355, long: -122.406944}],
  [ 'Charmander Park', {lat: 37.70927654, long: -122.088655}]
]

const Shortcuts = observer(() =>
  <div className="shortcuts">
    { shortcuts.map(([ location, coords ], idx) =>
      <div
        onClick={ (event) => {
          autopilot.stop()
          autopilot.speed = (event.shiftKey === true ? "~" : 13) / 3600 
          autopilot.scheduleTrip(coords.lat, coords.long)
            .then(() => {
              autopilot.steps = JSON.parse(JSON.stringify(autopilot.accurateSteps))
              autopilot.start()    
            })
        }}
        className="btn btn-sm btn-secondary"
      >
        Go { location }
      </div>
    )}
  </div>
)

export default Shortcuts
          