import { orderBy, reduce, map, capitalize } from 'lodash'

import React from 'react'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import cx from 'classnames'

import pokemonsList from '../../pokemons.json'
import pokemons from '../../models/pokemons.js'

const handleClick = (pokemon) => action(() => {
  if (pokemons.excluded.includes(pokemon)) {
    pokemons.excluded.remove(pokemon)
  } else {
    pokemons.excluded.push(pokemon)
  }
})

const filter = observable('')
const handleChangeFilter = action(({ target: { value } }) => filter.set(value))

const getPokemonsList = () => orderBy(reduce(pokemonsList, (res, value, key) => {
  const hasFilter = !!(filter.get() && filter.get().trim())
  const matchFilter = hasFilter && key.includes(filter.get())
  if (!hasFilter || matchFilter) {
    return [ ...res, {
      pokemon: key,
      image: value,
      count: pokemons.count[key] || 0,
      inactive: pokemons.excluded.includes(key)
    } ]
  }
  return res
}, []), [ 'count', 'inactive' ], [ 'desc', 'asc' ])

const ExcludedPokemons = observer(() =>
  <div className='excluded-pokemons'>
    <input
      type='text'
      className='form-control'
      value={ filter.get() }
      onChange={ handleChangeFilter }
      placeholder='Filter...' />
    <ul className='wrapper'>
      { map(getPokemonsList(), ({ pokemon, image, inactive, count }) =>
        <li
          key={ pokemon }
          className={ cx({ inactive }) }
          onClick={ handleClick(pokemon) }>
          <img
            alt={ pokemon }
            src={ `data:image/png;base64,${image}` } />
          { capitalize(pokemon) }
          <small> #{ Object.keys(pokemonsList).indexOf(pokemon) + 1 } </small>
          { count > 1 && <span className='pull-right tag tag-primary'>{ count }</span> }
        </li>) }
    </ul>
  </div>
)

export default ExcludedPokemons
