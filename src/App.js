import React from 'react';
import Home from './Home.js'
import Questions from './Questions.js'
import Daily from './Daily.js'
import './App.css'
import {Button} from 'reactstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.switchPage = this.switchPage.bind(this);
    this.state = {
      page:'home',
      title:'',
      total: 0,
      time: 0,
      deadline: ''
    };
  }

  handleAppTitle(titleValue) {
    this.setState({title: titleValue});
  }

  handleAppTotal(totalValue) {
    this.setState({total: totalValue});
  }

  handleAppTime(timeValue) {
    this.setState({time: timeValue});
  }

  handleAppDeadline(deadlineValue) {
    this.setState({deadline: deadlineValue});
  }

  switchPage() {
    if(this.state.page == 'home') {
      this.setState({page: 'daily'});
    }
    if(this.state.page == 'daily') {
      this.setState({page: 'questions'})
    }
    this.render();
  }
  handleChange(e){
    this.setState({name:e.target.value})
  }
  render() {
    if(this.state.page == 'home') {
      return (
      <div className = "App">
        <Home />
        <a href className = "Bt" onClick={this.switchPage}>
        </a>
      </div>
    );
    } else if (this.state.page == 'daily') {
      return (
        <div className = "App">
        <Daily />
        <a href className = "Bt" onClick={this.switchPage}>
        </a>
      </div>
        );
    } else if (this.state.page == 'questions') {
      return (
        <div className = "App">
        <Questions handleDayChange={(deadline) => this.handleAppDeadline(deadline)} 
          handleTime={(time) => this.handleAppTime(time)}
          handleTotal={(total) => this.handleAppTotal(total)}
          handleAsn={(title) => this.handleAppTitle(title)}/>
        <Button type="submit" onClick={this.switchPage}>Submit</Button>
      </div>
        );
    }
  }
}

export default App;