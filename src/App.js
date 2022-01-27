import React, { Component } from 'react';
import './App.css';
import './Button.css';
import Button from './Components/Button';
import Pokedex from './Pokedex';
import axios from 'axios';

class App extends Component {

  constructor() {
    super();
    this.state = {
      selecteds: [],
      onScreen: 0,
      next: false,
      list: [],
    }
    this.setPokemons = this.setPokemons.bind(this);
    this.nextPokemon = this.nextPokemon.bind(this);
    this.getNames();
  }

  stringToUpperCase (string) {
    return `${string.substring(0,1).toUpperCase()}${string.slice(1)}`
  }

  findIds(type) {
    if (!type || type === 'All') return this.state.list.map((poke) => poke.id);
    return this.state.list.reduce((acc, cur) => (
      cur.type === type ? acc.push(cur.id) && acc : acc
      ), [])
    }
    
  async getNames () {
      axios('https://pokeapi.co/api/v2/pokemon?limit=100')
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          names: data.results.map((poke) => poke.name)
        })
        )
        this.getPoke();
    })

    .catch((err) => console.log(err))
  }

  getPoke () {
    this.state.names.forEach((name) => {
    axios(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then(({ data }) => this.setState((state) => (
        {...state,
          onScreen: this.state.selecteds[0],
          selecteds: [...this.state.selecteds, data.id],
          list: [...this.state.list,
                  {
                    id: data.id,
                    name: this.stringToUpperCase(data.name),
                    averageWeight : {value: data.weight/10, measurementUnit: 'kg'},
                    image: data.sprites.front_default,
                    type: this.stringToUpperCase(data.types[0].type.name)
                  }
                ]
        }
      )))
    .catch((err) => console.log(err))
    })
  }

  setPokemons(type) {
    const set = this.findIds(type);
    const flag = set.length > 1 ? false : true
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
    if (!this.state.list.length) {
      return <p>Carregando...</p>
    }
    const pokeTypes = [...new Set(this.state.list.map((poke) => poke.type))];
    pokeTypes.unshift('All');
    return (
      <div className="App">
        <h1> Pokedex </h1>
        <Pokedex pokemons={this.state.list.filter(({id}) => id === this.state.onScreen)} />
        <h3>
          { `${this.state.selecteds.indexOf(this.state.onScreen)+1} de ${this.state.selecteds.length}` }
        </h3>
        <div className="button-cointainer">
          {
            pokeTypes.map((type, idx) => (
              <Button key={ idx } type={this.stringToUpperCase(type)} onClick={() => this.setPokemons(type)}/>
            ))
          }
        </div>
        <Button  type="Próximo pokemon" onClick={this.nextPokemon} disabled={this.state.next} style={this.state.style} />
      </div>
    );
  }
}

export default App;
