import React from 'react'
import axios from "axios"

const URL = 'http://localhost:9000/api/todos'


export default class App extends React.Component {

  constructor(){
    console.log('constructor ran')
    super();
    this.state = {
      todos: [],
      error: '',
    }
  }

  fetchTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({ ...this.state, todos: res.data.data }) //...this.state destructures the states but we only change todos
      })
      .catch(err => {
        this.setState({ ...this.state, error: err.response.data.message }) //Here we only update the state of error
      })
  }

  componentDidMount() {
    this.fetchTodos()
  }

  render() {
    console.log('render ran')
    return (
      <div>
        <div id="error">Error: { this.state.error }</div>
        <div id="todos">
          <h2>Todos:</h2>
          {
            this.state.todos.map(td => {
              return <div key={td.id}>{td.name}</div>
            })
          }
        </div>
        <form id="todoForm">
          <input type="text" placeholder="Type todo"></input>
          <input type="submit"></input>
          <button>Clear Completed</button>
        </form>
      </div>
    )
  }
}
