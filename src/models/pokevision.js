import { observable, action, toJS } from 'mobx'
import axios from 'axios'

import Alert from 'react-s-alert'

import userLocation from './user-location.js'

class Pokevision {

  // reference to `updatePokemonSpotsLoop` setTimeout
  timeout = null

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
      this.pokemonSpots.replace(this.calcTimeLeft(pokemon))
      this.updatePokemonSpotsLoop()
    } catch (error) {
      Alert.warning(`
        <strong>Could not get Pokémons spots</strong>
        <div class="stack">${error}</div>
      `, { timeout: 2000 })

      this.status = 'offline'
    }

    // refresh pokémon spots every 45s
    setTimeout(() => this.getPokemons(), 45 * 1000)
  }

  // loop to run every 500ms to update timeLeft before de-spawn
  // of the pokémon, and remove the old one.
  @action updatePokemonSpotsLoop = () => {
    const updatedSpots = this.calcTimeLeft(toJS(this.pokemonSpots))
    this.pokemonSpots.replace(updatedSpots)

    // clear old timeout
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }

    this.timemout = setTimeout(this.updatePokemonSpotsLoop, 500)
  }

  // calc human readable `timeLeft` from `expiration_time`
  calcTimeLeft = (spots) => spots.reduce((result, curr) => {
    const { expiration_time } = curr

    const diff = (expiration_time - (+Date.now() / 1000)) * 1000

    // pokémon spawn expired, remove it from list
    if (diff < 0) return result

    // update timeleft
    const minutesLeft = ((diff / 1000 / 60) << 0).toFixed()
    const secondsLeft = ((diff / 1000) % 60).toFixed()
    const timeLeft = `${minutesLeft}m ${secondsLeft}s`

    return [ ...result, { ...curr, timeLeft } ]
  }, [])

}

// start getting pokemons positions
const pokevision = new Pokevision()
pokevision.getPokemons()

export default pokevision
