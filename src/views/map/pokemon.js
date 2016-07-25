import { find } from 'lodash'

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

import pokevision from '../../models/pokevision.js'
import { pokemons } from '../../pokemons.json'

@observer
class Pokemon extends Component {

  props: {
    id: number;
    pokemonId: number;
    expires: number;
  }

  timeout = null
  @observable timeLeft = 0

  componentWillMount() {
    this.updateExpires()
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }

  updateExpires = () => {
    const { expires } = this.props
    const diff = (expires - (+Date.now() / 1000)) * 1000

    // pokémon spawn expired, remove it from list
    if (diff < 0) {
      const { id } = this.props
      const pokemon = find(pokevision.pokemonSpots, { id })
      return pokevision.pokemonSpots.remove(pokemon)
    }

    // update timeleft
    const minutesLeft = ((diff / 1000 / 60) << 0).toFixed()
    const secondsLeft = ((diff / 1000) % 60).toFixed()
    this.timeLeft = `${minutesLeft}m ${secondsLeft}s`

    if (this.timeout) this.componentWillUnmount() // clear old timeout
    this.timeout = setTimeout(() => this.updateExpires(), 500)
  }

  render() {
    const { pokemonId } = this.props

    return (
      <div className='pokemon'>
        <img
          alt={ `pokemon ${pokemonId}` }
          src={ `https://ugc.pokevision.com/images/pokemon/${pokemonId}.png` } />
        <div className='time-left'>
          <div><strong>{ pokemons[pokemonId - 1] }</strong></div>
          <div>{ this.timeLeft }</div>
        </div>
      </div>
    )
  }

}

export default Pokemon
