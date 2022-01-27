import React, { Component } from 'react';
import './App.css';
import './Button.css';
import Button from './Components/Button';
import { pokemons } from './data';
import Pokedex from './Pokedex';
import axios from 'axios';

class App extends Component {

  constructor() {
    super();
    this.names = [];
    const ids = this.findIds();
    this.state = {
      selecteds: ids,
      onScreen: ids[0],
      next: false
    }
    this.setPokemons = this.setPokemons.bind(this);
    this.nextPokemon = this.nextPokemon.bind(this);
    this.getPoke();
    this.getNames();
  }
  findIds(type) {
    if (!type || type === 'All') return pokemons.map((poke) => poke.id);
    return pokemons.reduce((acc, cur) => (
      cur.type === type ? acc.push(cur.id) && acc : acc
      ), [])
    }
    
    async getNames () {
      this.names = await axios('https://pokeapi.co/api/v2/pokemon?limit=100')
      .then(({ data }) => data.results.map((poke) => poke.name))
    .catch((err) => console.log(err))
  }

  getPoke () {
    axios('https://pokeapi.co/api/v2/pokemon/pikachu')
    .then(({ data }) => this.setState((state) => ({...state, teste: [{
      id: data.id,
      name: data.name,
      averageWeight : {value: data.weight, measurementUnit: 'kg'},
      image: data.sprites.front_default
    }]})))
    .catch((err) => console.log(err))
  }

  setPokemons(type) {
    const set = this.findIds(type);
    const flag = set.length > 1 ? false : true
    console.log(this.names);
    this.setState({
      selecteds: set,
      onScreen: set[0],
      next: flag,
      style: flag ? {backgroundColor:'#a9a9a9'} : {backgroundColor: '#fa6400'}
    })
  }

  nextPokemon() {
    this.setState((state) => ({
      ...state,
      onScreen: state.selecteds[state.selecteds.indexOf(state.onScreen)+1] || state.selecteds[0]
    }))
  }
  
  render() {
    if (!this.state.teste) {
      return <p>Carregando...</p>
    }
    const pokeTypes = [...new Set(pokemons.map((poke) => poke.type))];
    pokeTypes.unshift('All');
    return (
      <div className="App">
        <h1> Pokedex </h1>
        {/* <Pokedex pokemons={pokemons.filter(({id}) => id === this.state.onScreen)} /> */}
        <Pokedex pokemons={this.state.teste} />
        <div className="button-cointainer">
          {
            pokeTypes.map((type, idx) => (
              <Button key={ idx } type={type} onClick={() => this.setPokemons(type)}/>
            ))
          }
        </div>
        <Button  type="Próximo pokemon" onClick={this.nextPokemon} disabled={this.state.next} style={this.state.style} />
      </div>
    );
  }
}

export default App;
