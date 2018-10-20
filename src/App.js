import React from 'react';
import Home from './Home.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      page:'home',
      title:'',
      time: 0,
      deadline: ''
    };
  }
  switchPage() {
    console.log("Home!")
  }
  handleChange(e){
    this.setState({name:e.target.value})
  }
  render() {
    return (
      <div className = "App">
        <Home />
        <button onClick={this.switchPage}>
            <img src="./img/google.png" alt="" onClick={this.myfunction} />
        </button>
      </div>
    )
  }
}

export default App;