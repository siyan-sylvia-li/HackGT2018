import React from 'react';
import Home from './Home.js'
import Questions from './Questions.js'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.switchPage = this.switchPage.bind(this);
    this.state = {
      page:'home',
      title:'',
      time: 0,
      deadline: ''
    };
  }
  switchPage() {
    if(this.state.page === 'home') {
      this.setState({page: 'questions'});
    }
    this.render();
  }
  handleChange(e){
    this.setState({name:e.target.value})
  }
  render() {
    if(this.state.page === 'home') {
      return (
      <div className = "App">
        <Home />
        <a href className = "Bt" onClick={this.switchPage}>
        </a>
      </div>
    );
    } else if (this.state.page === 'questions') {
      return (
        <div className = "App">
        <Questions />
        <a href className = "Bt" onClick={this.switchPage}>
        </a>
      </div>
        )
    }
  }
}

export default App;