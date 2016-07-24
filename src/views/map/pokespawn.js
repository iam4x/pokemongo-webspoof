@@ -0,0 +1,60 @@
import React from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import pokedex from '../../models/pokedex.js'

const PokemonSpawn = React.createClass({
  getInitialState: function() {
    return {
    	expiration_time: this.props.spawn.expiration_time * 1000,
    	endOfLife: {
    		minutes: 0,
    		seconds: 0
    	}
    };
  },
  tick: function() {
  	var eol = moment(this.state.expiration_time).diff(moment(), 'seconds');
//  	console.log(eol);
    this.setState({
     	endOfLife: {
     		minutes: Math.floor(eol / 60),
     		seconds: eol % 60
     	}
     }, function() {
     	if (this.state.endOfLife.minutes < 0) {
      	clearInterval(this.interval);
     	}
     });
  },
  componentDidMount: function() {
    this.setState({ expiration_time: this.props.spawn.expiration_time * 1000, 
    	endOfLife: {
    		minutes: 0,
    		seconds: 0
    	}});
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

	render: function() {
	  return (
	  	<div>
	  	{ (this.state.endOfLife.minutes < 0) ?
	  		<div></div>	:
		  	<div className='pokespawn'>
		  		<img className='pokemon' src={`https://ugc.pokevision.com/images/pokemon/${ this.props.spawn.pokemonId }.png`} alt={this.props.spawn.pokemonId} />
		  		<div className='info'>
			  		<div className='endoflife'>{this.state.endOfLife.minutes}:{this.state.endOfLife.seconds}</div>
			  		<div className='name'>{pokedex[this.props.spawn.pokemonId]}</div>
		  		</div>
		  	</div>
	  	}
	  	</div>
	  )
	}
})

export default PokemonSpawn
