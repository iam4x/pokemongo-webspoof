import React, { Component } from 'react'
import { action } from 'mobx'
import places from 'places.js'

import userLocation from '../models/user-location.js'

class GoToPlace extends Component {

  componentDidMount() {
    // initialize algolia places input
    const { placesEl } = this.refs
    this.placesAutocomplete = places({ container: placesEl })
    this.placesAutocomplete.on('change', this.handleSuggestionChange)
  }

  @action handleSuggestionChange({ suggestion: { latlng: { lat, lng } } }) {
    userLocation.replace([ lat, lng ])
  }

  render() {
    return (
      <div className='places'>
        <input ref='placesEl' type='search' placeholder='Go to place' />
      </div>
    )
  }

}

export default GoToPlace
