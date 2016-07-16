import { last } from 'lodash'

import axios from 'axios'
import { observable } from 'mobx'
import Alert from 'react-s-alert'

const cheerio = window.require('cheerio')

const serverStatus = observable([ 'unknow', 'default' ])
const isLoading = observable(false)

const STATUS_WEBSITE_URL = 'http://cmmcd.com/PokemonGo/'

const STATUSES = [
  [ 'online', 'success' ],
  [ 'unstable', 'warning' ],
  [ 'offline', 'danger' ]
]

const checkStatus = async () => {
  isLoading.set(true)

  try {
    const { data } = await axios.get(STATUS_WEBSITE_URL)

    // find raw text status on webpage
    const $ = cheerio.load(data)
    const foundStatus = $($('.jumbotron h2 font')[0]).html()

    // transform it standard status
    const status = STATUSES.reduce(
      (result, [ val, className ]) =>
        !result && foundStatus.toLowerCase().includes(val) ? [ val, className ] : result, null
    )

    // if we didn't match a standard status, return `offline`
    serverStatus.replace(status || last(STATUSES))
  } catch (err) {
    Alert.error(`
      <strong>Could not check server status</strong>
      <div class='stack'>${err}</div>
    `)

    serverStatus.replace(last(STATUSES))
  }

  isLoading.set(false)

  // check again in twenty seconds
  window.setTimeout(() => checkStatus(), 20 * 1000)
}

// check directly status
checkStatus()

export default { serverStatus, isLoading }
