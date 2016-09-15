import { reduce, map, capitalize } from 'lodash'

import React from 'react'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'

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

const getPokemonsList = () => reduce(pokemonsList, (res, value, key) => {
  const hasFilter = !!(filter.get() && filter.get().trim())
  const matchFilter = hasFilter && key.includes(filter.get())
  if (!hasFilter || matchFilter) return ({ ...res, [key]: value })
  return res
}, {})

const ExcludedPokemons = observer(() =>
  <div className='excluded-pokemons'>
    <input
      type='text'
      className='form-control'
      value={ filter.get() }
      onChange={ handleChangeFilter }
      placeholder='Filter...' />
    <ul className='wrapper'>
      { map(getPokemonsList(), (value, key) =>
        <li
          key={ key }
          className={ pokemons.excluded.includes(key) ? 'inactive' : undefined }
          onClick={ handleClick(key) }>
          <img
            alt={ key }
            src={ `data:image/png;base64,${value}` } />
          { capitalize(key) }
          <small> #{ Object.keys(pokemonsList).indexOf(key) + 1 }</small>
        </li>) }
    </ul>
  </div>
)

export default ExcludedPokemons
