import React, { Component } from 'react'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import places from 'places.js'
import cx from 'classnames'

import autopilot from '../../models/autopilot.js'

@observer
class Autopilot extends Component {

  @observable isModalOpen = false

  componentDidMount() {
    // initialize algolia places input
    const { placesEl } = this.refs
    this.placesAutocomplete = places({ container: placesEl })
    this.placesAutocomplete.on('change', this.handleSuggestionChange)
  }

  @action openAutoPilotModal = () => {
    this.isModalOpen = true
  }

  @action handleSuggestionChange = ({ suggestion: { latlng: { lat, lng } } }) => {
    autopilot.scheduleTrip(lat, lng)
  }

  @action handleStartAutopilot = (e) => {
    e.preventDefault()

    // reset modal state
    this.placesAutocomplete.setVal(null)
    this.isModalOpen = false

    autopilot.start()
  }

  renderTogglePause() {
    if (autopilot.running && !autopilot.paused) {
      return (
        <div
          className='toggle pause btn btn-sm btn-warning'
          onClick={ autopilot.pause }>
          <i className='fa fa-pause' />
        </div>
      )
    }

    if (autopilot.paused) {
      return (
        <div
          className='toggle resume btn btn-sm btn-success'
          onClick={ autopilot.start }>
          <i className='fa fa-play' />
        </div>
      )
    }

    return <noscript />
  }

  render() {
    return (
      <div className='autopilot'>
        { this.renderTogglePause() }

        { !autopilot.running && !autopilot.paused ?
          <div
            className='autopilot-btn btn btn-sm btn-success'
            onClick={ this.openAutoPilotModal }>
             Tesla Autopilot ( ͡° ͜ʖ ͡°)
          </div> :
          <div
            className='autopilot-btn btn btn-sm btn-danger'
            onClick={ autopilot.stop }>
            Stop autopilot
          </div> }

        <div className={ cx('autopilot-modal', { open: this.isModalOpen }) }>
          <div className='algolia-places'>
            <input ref='placesEl' type='search' placeholder='Destination' />
          </div>

          { autopilot.steps.length ?
            <div className='infos'>
              <hr />

              <div>
                <strong>Distance: </strong>
                <span className='tag tag-info'>
                  { autopilot.distance.toFixed(2) } km
                </span>
              </div>

              <div>
                <strong>Speed: </strong>
                <span className='tag tag-info'>
                  12 km/h
                </span>
              </div>

              <div>
                <strong>Time: </strong>
                <span className='tag tag-info'>
                  { autopilot.time }
                </span>
              </div>
            </div> :
            <noscript /> }

          <hr />

          <button
            type='button'
            className='btn btn-block btn-sm btn-success'
            disabled={ autopilot.steps.length === 0 }
            onClick={ this.handleStartAutopilot }>
            Start autopilot!
          </button>
        </div>
      </div>
    )
  }

}

export default Autopilot
