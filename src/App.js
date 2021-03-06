import React, { Component } from 'react';
import './App.css';
import './Button.css';
import Button from './Components/Button';
import Pokedex from './Pokedex';
import axios from 'axios';

class App extends Component {
  
  constructor() {
    super();
    this.style = {
      orange: {backgroundColor: '#fa6400'},
      gray: {backgroundColor:'#a9a9a9'}
    }
    this.state = {
      selecteds: [],
      onScreen: 0,
      list: [],
    }
    this.getNames();
  }
  
  stringToUpperCase = (string) => `${string.substring(0,1).toUpperCase()}${string.slice(1)}`
  
  findIds(type) {
    if (!type || type === 'All') return this.state.list.map((poke) => poke.id);
    return this.state.list.reduce((acc, cur) => (
      cur.type === type ? acc.push(cur.id) && acc : acc
      ), [])
    }
    
    async getNames (number=1) {
      this.setState((state) => ({
        ...state,
        names: [],
        list: [],
        selecteds: []
      }))
      axios(`https://pokeapi.co/api/v2/pokemon?limit=${number}&offset=${Math.random() * (200 - 1) + 1}`)
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
      if (this.state.names) {
        this.state.names.forEach((name) => {
          axios(`https://pokeapi.co/api/v2/pokemon/${name}`)
          .then(({ data }) => this.setState((state) => (
            {...state,
              onScreen: state.selecteds[0] || data.id,
              selecteds: [...state.selecteds, data.id],
              next: !state.selecteds.length ? true : false,
              style: !state.selecteds.length ? this.style.gray : this.style.orange,
              list: [...state.list,
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
      }
      
      setPokemons = (type) => {
        const set = this.findIds(type);
        const flag = set.length > 1 ? false : true
        this.setState({
          selecteds: set,
          onScreen: set[0],
          next: flag,
          style: flag ? this.style.gray : this.style.orange
        })
      }
      
      handleCatch = (event) => {
        this.setState({
          ...this.state,
          catch: event.target.value
        })
      }
      
      nextPokemon = () => {
        this.setState((state) => ({
          ...state,
          onScreen: state.selecteds[state.selecteds.indexOf(state.onScreen)+1] || state.selecteds[0]
        }))
      }
      
      render() {
        if (!this.state.list.length) {
          return (
            <div className='App'>
              <p className="loading">Loading...</p>
            </div>
          )
        }
        const pokeTypes = [...new Set(this.state.list.map((poke) => poke.type))];
        pokeTypes.unshift('All');
        return (
          <>
          <div className="App">
          <h1> Pokedex </h1><br />
          <h2>Quantos pokemons voc?? deseja capturar?</h2>
          <div className="catch-container">
          <input name="catch" type="number" onChange={this.handleCatch} min="1"/>
          <button onClick={() => this.getNames(this.state.catch)}>Eu escolho voc??!!!</button>
          </div>
          <Pokedex pokemons={this.state.list.filter(({id}) => id === this.state.onScreen)} />
          <h3>
          { `${this.state.selecteds.indexOf(this.state.onScreen)+1} de ${this.state.selecteds.length}` }
          </h3>
          <div className="button-container">
          {
            pokeTypes.map((type, idx) => (
              <Button key={ idx } type={this.stringToUpperCase(type)} onClick={() => this.setPokemons(type)}/>
              ))
            }
            </div>
            <Button  type="Pr??ximo Pokemon >>" onClick={this.nextPokemon} disabled={this.state.next} style={this.state.style} />
            </div>
            </>
            );
          }
        }
        
        export default App;