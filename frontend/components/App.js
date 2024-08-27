import React from 'react'
import axios from "axios"
import Form from './Form'
import TodoList from './TodoList'

const URL = 'http://localhost:9000/api/todos'


export default class App extends React.Component {

  constructor(){
    console.log('constructor ran')
    super();
    this.state = {
      todos: [],
      error: '',
      todoNameInput: '',
      displayCompleteds: true,
    }
  }

  onChange = evt => {
    const { value } = evt.target //extracts value typed from evt
    this.setState({ ...this.state, todoNameInput: value }) //Updating todoNameInput state to value
  }

  resetForm = () => this.setState({ ...this.state, todoNameInput: '' })

  setAxiosResponseError = err => this.setState({ ...this.state, error: err.response.data.message })

  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoNameInput}) //The raw data posted needs to be an object name
    .then(res => {
      //this.fetchTodos()
      this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data) })
      this.resetForm() //resets the form after successful submit
    })
    .catch(this.setAxiosResponseError)
  }

  onSubmit = evt => {
    evt.preventDefault() //prevent page refreshing when hitting submit
    this.postNewTodo()
  }

  fetchTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({ ...this.state, todos: res.data.data }) //...this.state destructures the states but we only change todos
      })
      .catch(this.setAxiosResponseError)
  }

  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
      .then(res =>{
        this.setState({
          ...this.state, todos: this.state.todos.map(td => {
            if (td.id !== id) return td  
            return res.data.data
          })
        })
      })
      .catch(this.setAxiosResponseError)
  }

  toggleDisplayCompleteds = () =>{
    this.setState({ ...this.state, displayCompleteds: !this.state.displayCompleteds })
  }

  componentDidMount() {
    this.fetchTodos()
  }

  render() {
    console.log('render ran')
    return (
      <div>
        <div id="error">Error: { this.state.error }</div>
        <TodoList 
          todos={this.state.todos}
          displayCompleteds={this.state.displayCompleteds}
          toggleCompleted={this.toggleCompleted}   
        />
        <Form 
          onSubmit={this.onSubmit}
          todoNameInput={this.state.todoNameInput}
          onChange={this.onChange}
          toggleDisplayCompleteds={this.toggleDisplayCompleteds}
          displayCompleteds={this.state.displayCompleteds}
        />
      </div>
    )
  }
}
