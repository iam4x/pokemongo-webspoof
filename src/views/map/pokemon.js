import { capitalize } from 'lodash'
import React from 'react'

import pokemons from '../../pokemons.json'

type Props = {
  onClick: Function;
  pokemon: {
    pokemon_id: string;
    lnglat: Object;
    encounter_id: string;
    spawn_id: string;
    expireAt: string;
    timeLeft: string;
  }
}

const Pokemon = ({ pokemon, onClick }: Props) => {
  const { pokemon_id, timeLeft } = pokemon
  const base64Image = pokemons[pokemon_id.toLowerCase()]

  return (
    <div className='pokemon'>
      <img
        onClick={ onClick }
        alt={ `pokemon ${pokemon_id}` }
        src={ `data:image/png;base64,${base64Image}` } />
      <div className='time-left'>
        <strong>{ capitalize(pokemon_id) }</strong>
        <div>{ timeLeft }</div>
      </div>
    </div>
  )
}

export default Pokemon
