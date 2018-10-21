import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class Questions extends React.Component {
  constructor(props) {
    super(props);
    // this.handleChange = this.handleChange.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleTotal = this.handleTotal.bind(this);
    this.handleAsn = this.handleAsn.bind(this);
    this.state = {
      selectedDay: undefined,
    };
  }

  // handleChange(value, formattedValue) {
  //   this.setState({
  //     value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
  //     formattedValue: formattedValue // Formatted String, ex: "11/19/2016"
  //   });

  // }
  handleDayChange(day) {
    // this.props.handleDeadline(day);
    this.props.handleDayChange(day);
  }

  handleTime(event) {
    this.props.handleTime(event.target.value);
  }

  handleTotal(event) {
    this.props.handleTotal(event.target.value);
  }

  handleAsn(event) {
    this.props.handleAsn(event.target.value);
  }
  
  render() {
    // this.getInitialVal();
    return (
      <div className = "Questions">
      <Form>
        <FormGroup>
        <Label for="assignment">What is your assignment?</Label>
          <Input type="text" name="assignment" id="assignment" placeholder="Put your assignment here" 
            onChange={this.handleAsn}/>
        </FormGroup>
        <FormGroup>
        <Label for="total">How long would you like to spend on the assignment in total?</Label>
          <Input type="number" name="total" id="total" placeholder="Put your planned amount of time here" 
            onChange = {this.handleTotal}/>
        </FormGroup>
        <FormGroup>
          <Label for="exampleSelect">How long do you want each session to be?</Label>
          <Input type="select" name="select" id="exampleSelect"
            onChange={this.handleTime}>
            <option>1 Hour</option>
            <option>2 Hour</option>
            <option>3 Hour</option>
            <option>4 Hour</option>
            <option>5 Hour</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="deadline">When is your deadline?</Label>
          <div>
        {this.state.selectedDay && <p>Day: {this.state.selectedDay.toLocaleDateString()}</p>}
        {!this.state.selectedDay && <p>Choose a day</p>}
        <DayPickerInput onDayChange={this.handleDayChange} />
        </div>
        </FormGroup>
      </Form>
      </div>
    );
  }
}

export default Questions;