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

  handleTitle(titleValue) {
    this.setState({title: titleValue});
  }

  handleTotal(totalValue) {
    this.setState({total: totalValue});
  }

  handleTime(timeValue) {
    this.setState({time: timeValue});
  }

  handleDeadline(deadlineValue) {
    this.setState({deadline: deadlineValue});
  }

  switchPage() {
<<<<<<< HEAD
    if(this.state.page === 'home') {
      this.setState({page: 'questions'});
=======
    if(this.state.page == 'home') {
      this.setState({page: 'daily'});
    }
    if(this.state.page == 'daily') {
      this.setState({page: 'questions'})
>>>>>>> fdffa4bc178d8f4b0f385f8c3385702efbaed2fd
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
    } else if (this.state.page == 'daily'
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
        <Questions />
        <Button type="submit" onClick={this.switchPage}>Submit</Button>
      </div>
        );
    }
  }
}

export default App;
