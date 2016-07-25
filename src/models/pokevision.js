import { observable, action } from 'mobx'
import axios from 'axios'

import Alert from 'react-s-alert'

import userLocation from './user-location.js'

class Pokevision {

  @observable pokemonSpots = []
  @observable status = 'unknown'

  @action getPokemons = async () => {
    const [ latitude, longitude ] = userLocation

    // dont query pokémon spots until we have a location
    // retry in 3seconds
    if (!latitude || !longitude) {
      return setTimeout(() => this.getPokemons(), 3 * 1000)
    }

    try {
      const url = `https://pokevision.com/map/data/${latitude}/${longitude}`
      const { headers, ...resp } = await axios({ url })

      // check that we receive json content or it might mean that pokévision API is down
      const isJSON = headers['content-type'].toLowerCase().includes('json')
      if (!isJSON) throw new Error('Could not parse pokévision response')

      // replace pokémon spots by new one :+1:
      const { data: { pokemon } } = resp
      this.status = 'online'
      this.pokemonSpots.replace(pokemon)
    } catch (error) {
      Alert.warning(`
        <strong>Could not get Pokémons spots</strong>
        <div class="stack">${error}</div>
      `)

      this.status = 'offline'
    }

    // refresh pokémon spots every 45s
    setTimeout(() => this.getPokemons(), 45 * 1000)
  }

}

// start getting pokemons positions
const pokevision = new Pokevision()
pokevision.getPokemons()

export default pokevision
