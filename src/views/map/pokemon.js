import React from 'react'

import { pokemons } from '../../pokemons.json'

type Props = {
  pokemon: {
    id: number;
    data: string;
    expiration_time: number;
    pokemonId: number;
    latitude: number;
    longitude: number;
    uid: string;
    is_alive: boolean;
    timeLeft: string;
  }
}

const Pokemon = ({ pokemon }: Props) => {
  const { pokemonId, timeLeft } = pokemon

  return (
    <div className='pokemon'>
      <img
        alt={ `pokemon ${pokemonId}` }
        src={ `https://ugc.pokevision.com/images/pokemon/${pokemonId}.png` } />
      <div className='time-left'>
        <strong>{ pokemons[pokemonId - 1] }</strong>
        <div>{ timeLeft }</div>
      </div>
    </div>
  )
}

export default Pokemon
