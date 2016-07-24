import { throttle } from 'lodash'
import axios from 'axios'
import { observable, asMap } from 'mobx'
import moment from 'moment'

const serverStatus = observable([ 'unknown', 'default' ])
const isLoading = observable(false)
const spawns = asMap({})
var counter = 0

const STATUSES = [
  [ 'online', 'success' ],
  [ 'offline', 'danger' ]
]

const checkPokemonSpawns = throttle(async (latitude, longitude) => {
  counter++;
  isLoading.set(true);
  console.log('checking spawns')
  const url = `https://pokevision.com/map/data/${latitude}/${longitude}`

  try {
    const {data, status} = await axios.get(url);
    if (status == 200 && data.status === "success") {
      if (counter > 5) {
        counter = 0;
        spawns.clear();
      }

      data.pokemon.map(p => {
        spawns.set(p.id, p)
      })

      serverStatus.replace(STATUSES[0])    
    } else {
      spawns.clear()
      serverStatus.replace(STATUSES[1])
    }
  } catch(err) {
    spawns.clear()
    serverStatus.replace(STATUSES[1])
  } finally {
    isLoading.set(false)
  }
}, 5000)

const scanPokemonSpawns = throttle(async (latitude, longitude) => {
  const scanUrl = `https://pokevision.com/map/scan/${latitude}/${longitude}`
  await axios.get(scanUrl)
}, 60000);

export default { serverStatus, checkPokemonSpawns, scanPokemonSpawns, spawns, isLoading }
