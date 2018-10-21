import React from 'react';
// import TimePicker from 'react-bootstrap-time-picker';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import Item from './Item.js';

  class Daily extends React.Component {
  constructor(props) {
    super(props);
    // this.handleChange = this.handleChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleBeginChange = this.handleBeginChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.counter = 0;
    this.state = {
      events: [],
      currentName: '',
      currentBegin: '',
      currentEnd: '',
      boxList: [<Item key={this.counter} handleAct = {(name) => this.handleNameChange(name)}
                  handleBegin = {(b) => this.handleBeginChange(b)}
                  handleEnd = {(e) => this.handleEndChange(e)}/>]
    };
  }

  handleNameChange(nameValue) {
    this.setState({currentName: nameValue});
  }

  handleBeginChange(beginValue) {
    this.setState({currentBegin: beginValue});
  }

  handleEndChange(endValue) {
    this.setState({currentEnd: endValue});
  }

  addItem() {
    console.log("AHHHHHHHH");
    this.counter = this.counter + 1;
    const newItem = <Item key={this.counter} handleAct = {(name) => this.handleNameChange(name)}
                  handleBegin={(b) => this.handleBeginChange(b)}
                  handleEnd={(e) => this.handleEndChange(e)}/>
    this.setState(prevState => ({
      boxList: [...prevState.boxList, newItem]
    }));
    var begin = this.state.currentBegin;
    var pos = begin.search(":");
    var beginNum = 0;
    if(begin.charAt(pos + 1) == '3') {
      beginNum = 0.5;
    }
    beginNum = beginNum + parseInt(begin.slice(pos - 2, pos), 10);
    console.log(beginNum);

    var end = this.state.currentEnd;
    pos = end.search(":");
    var endNum = 0;
    if(end.charAt(pos + 1) == '3') {
      endNum = 0.5;
    }
    endNum = endNum + parseInt(end.slice(pos - 2, pos), 10);
    console.log(endNum);
    var str = '{"activity": "' + this.state.currentName
      + '", "begin": ' + beginNum + ', "end": '
      + endNum + '}';


   const writeFileP = require("write-file-p");
        writeFileP.sync(`daily.json`, {
          activity: this.state.currentName,
          begin: this.state.currentBegin,
          end: this.state.currentEnd
});


    // const writeJsonFile = require('write-json-file');
 
    // (async () => {
    //     await writeJsonFile('daily.json', obj);
    // })();

    // fetch('http://127.0.0.1:5000/', {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       'Access-Control-Allow-Origin': '*',
    //     },
    //     body: '{"activity": "' + this.state.currentName
    //   + '", "begin": ' + beginNum + ', "end": '
    //   + endNum + '}',
    //   }).then(response => response.json())
    //   .then(data => console.log(data));
  }

    render() {
      // todoComponents.push(
      //   <Todo
      //     key={i}
      //     text={this.state.todos[i]}
      //     onDelete={deleteFunction} />
      // );

    //   return (
    //   <div className="TodoList">
    //     {todoComponents}
    //   </div>
    // );
      return (
        <div className = "Daily">
            <h3> What is your daily routine like?</h3>
            <p> Add anything you wish us to account for in your scheduling </p>
              {this.state.boxList}
            <Button onClick={this.addItem}>Add Item</Button>
        </div>
      );
    }
  }

  export default Daily;