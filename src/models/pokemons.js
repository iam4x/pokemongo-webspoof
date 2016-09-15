import { flatten, uniqBy } from 'lodash'
import { computed, observable, action } from 'mobx'
import axios from 'axios'

import Alert from 'react-s-alert'

import userLocation from './user-location.js'

const request = window.require('request-promise-native')

class Pokemons {

  // reference to `updatePokemonSpotsLoop` setTimeout
  timeout = null

  /* eslint max-len: 0 */
  // fake headers to query fastpokemap.se easily
  API_HEADERS = {
    pragma: 'no-cache',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2858.0 Safari/537.36',
    'cache-control': 'no-cache',
    origin: 'https://fastpokemap.se',
    authority: 'cache.fastpokemap.se'
  }

  @observable ip = null
  @observable pokemonSpots = []
  @observable status = 'unknown'

  @observable excluded = [
    'pidgey', 'poliwag', 'caterpie', 'zubat', 'staryu',
    'rattata', 'spearow', 'goldeen', 'weedle', 'pinsir',
    'kakuna', 'golbat', 'drowzee', 'raticate', 'fearow',
    'krabby', 'bellsprout', 'psyduck', 'magikarp', 'tentacool',
    'jigglypuff', 'paras', 'oddish', 'pidgeotto', 'doduo', 'dodrio',
    'slowpoke', 'seel', 'jynx', 'gastly', 'horsea', 'venonat', 'tangela',
    'meowth', 'ekans', 'sandshrew', 'clefairy', 'shellder', 'magmar', 'vulpix',
    'electabuzz', 'koffing', 'golduck', 'pidgeot', 'nidoran_male', 'nidoran_female',
    'metapod'
  ]

  @computed get spots() {
    return this.pokemonSpots.filter(
      ({ pokemon_id }) =>
        !this.excluded.includes(pokemon_id.toLowerCase())
    )
  }

  @computed get count() {
    return this.pokemonSpots.reduce((res, curr) => {
      const pokemonName = curr.pokemon_id.toLowerCase()
      if (res[pokemonName]) {
        return ({ ...res, [pokemonName]: res[pokemonName] + 1 })
      } else {
        return ({ ...res, [pokemonName]: 1 })
      }
    }, {})
  }

  @action setIPAddress = async () => {
    try {
      const { data: { ip } } = await axios.get('https://api.ipify.org?format=json')
      this.ip = ip

      this.getPokemons()
      this.getNearestPokemons()
    } catch (error) {
      console.warn('could not find IP, retry in 10s')
      console.warn(error)

      setTimeout(::this.setIPAddress, 10 * 1000)
    }
  }

  @action getPokemons = async () => {
    const [ latitude, longitude ] = userLocation

    // dont query pokémon spots until we have a location
    // retry in 3seconds
    if (!latitude || !longitude) {
      return setTimeout(() => this.getPokemons(), 3 * 1000)
    }

    try {
      const baseURL = 'https://cache.fastpokemap.se/?key=allow-all&ts=0&compute='
      const uri = `${baseURL}${this.ip}&lat=${latitude}&lng=${longitude}`

      const pokemons = await Promise.all([
        request({ uri, headers: this.API_HEADERS, json: true }),
        request({ uri: uri.replace(latitude, latitude - 0.03), headers: this.API_HEADERS, json: true }),
        request({ uri: uri.replace(latitude, latitude + 0.03), headers: this.API_HEADERS, json: true }),
        request({ uri: uri.replace(longitude, longitude - 0.04), headers: this.API_HEADERS, json: true }),
        request({ uri: uri.replace(longitude, longitude + 0.04), headers: this.API_HEADERS, json: true })
      ])

      // replace pokémon spots by new one :+1:
      this.status = 'online'
      this.mergePokemons(flatten(pokemons))
    } catch (error) {
      Alert.warning(`
        <strong>Could not get Pokémons spots</strong>
        <div class="stack">${error}</div>
      `, { timeout: 2000 })

      console.warn(error)

      this.status = 'offline'
    }

    // refresh pokémon spots every 45s
    setTimeout(::this.getPokemons, 45 * 1000)
  }

  @action getNearestPokemons = async () => {
    const [ latitude, longitude ] = userLocation

    if (!latitude || !longitude) {
      return setTimeout(() => this.getNearestPokemons(), 3 * 1000)
    }

    try {
      const baseURL = 'https://api.fastpokemap.se/?key=allow-all&ts=0'
      const uri = `${baseURL}&lat=${latitude}&lng=${longitude}`

      const { result, error } =
        await request({ uri, headers: this.API_HEADERS, json: true })

      // recursive xhr call if it's `overload`
      if (error === 'overload') {
        console.log('overload nearest pokemons -> retry in 500ms')
        return setTimeout(::this.getNearestPokemons, 500)
      }

      console.log(
        'NEAREST_POKEMONS:',
        result.map(({ pokemon_id }) => pokemon_id).join(' ')
      )

      this.mergePokemons(result)
    } catch (err) {
      console.warn(err)
      this.status = 'offline'
    }

    setTimeout(::this.getNearestPokemons, 10 * 1000)
  }

  // loop to run every 500ms to update timeLeft before de-spawn
  // of the pokémon, and remove the old one.
  @action updatePokemonSpotsLoop = () => {
    const updatedSpots = this.calcTimeLeft(this.pokemonSpots)
    this.pokemonSpots.replace(updatedSpots)

    // clear old timeout
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }

    this.timemout = setTimeout(this.updatePokemonSpotsLoop, 5 * 1000)
  }

  @action mergePokemons = (newPokemons) => {
    const pokemons = uniqBy(
      [ ...this.pokemonSpots, ...newPokemons ],
      ({ encounter_id, spawn_id, pokemon_id, spawn_point_id }) =>
        encounter_id + (spawn_id || spawn_point_id) + pokemon_id
    )

    this.pokemonSpots.replace(this.calcTimeLeft(pokemons))
  }

  // calc human readable `timeLeft` from `expiration_time`
  calcTimeLeft = (spots) => spots.reduce((result, curr) => {
    const { expireAt, expiration_timestamp_ms } = curr
    const expires = expireAt || parseInt(expiration_timestamp_ms, 10)

    // filter out pokemons without expires
    if (!expires) return result

    const diff = new Date(expires) - new Date()

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
const pokemons = new Pokemons()
pokemons.setIPAddress()
pokemons.updatePokemonSpotsLoop()

export default pokemons
