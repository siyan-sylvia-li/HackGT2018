import React from 'react';
import Home from './Home.js'
import Questions from './Questions.js'
import Daily from './Daily.js'
import './App.css'
import {Button} from 'reactstrap';
import API from './API.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.switchPage = this.switchPage.bind(this);
    this.state = {
      page:'home',
      title:'',
      total: 1,
      time: 1,
      deadline: ''
    };
  }

  // For Questions.js

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
      this.setState({page: 'questions'});
      ///parse events
    }
    if(this.state.page == 'questions') {
      var str = '{"assignment":"' + this.state.title
      + '", "deadline":"' + this.state.deadline + '", "totalTime":"'
      + this.state.totalTime + '", "timeslotLength":"'
      + this.state.time + '"}';

       const jsonfile = require('jsonfile')
 
        const file = 'questions.json'
        const obj = JSON.parse(str);
 
jsonfile.writeFile(file, obj, function (err) {
  if (err) console.error(err)
});
    //   const writeJsonFile = require('write-json-file');
 
    // (async () => {
    //     await writeJsonFile('questions.json', obj);
    // })();
//       fetch('https://mywebsite.com/endpoint/', {
//   method: 'POST',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     firstParam: 'yourValue',
//     secondParam: 'yourOtherValue',
//   })
// })
      // fetch('http://localhost:5000/', {
      //   method: 'POST',
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json'
      //   },
      //   body: '{"assignment":"' + this.state.title
      // + '", "deadline":"' + this.state.deadline + '", "totalTime":"'
      // + this.state.totalTime + '", "timeslotLength":"'
      // + this.state.time + '"}'
      // }).then(response => response.json())
      // .then(data => console.log(data));
      //// JSON OBJECT INSERT HERE
      this.setState({page: 'api'})
    }
    this.render();
  }

  handleChange(e){
    this.setState({name:e.target.value})
  }


  // For Parsing JSON data

  render() {
    if(this.state.page === 'home') {
      return (
      <div className = "App">
        <Home />
        <a href className = "Bt" onClick={this.switchPage}>
        </a>
      </div>
    );
    } else if (this.state.page == 'daily'){
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
    } else if (this.state.page == 'api') {
      return(
        <div className = "App">
        <API />
      </div>
        );
    }
  }
}

export default App;
