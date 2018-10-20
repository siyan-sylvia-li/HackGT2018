import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';

var DatePicker = require("react-bootstrap-date-picker");

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.getInitialVal = this.getInitialVal.bind(this);
    this.state = {
      value: '',
      formattedValue: ''
    };
  }

  getInitialVal() {
    var value = new Date().toISOString();
    this.setState({value: value});
  }
  handleChange(value, formattedValue) {
    this.setState({
      value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValue: formattedValue // Formatted String, ex: "11/19/2016"
    });
  }
  
  render() {
    this.getInitialVal();
    return (
      <div className = "Questions">
      <Form>
        <FormGroup>
        <Label for="assignment">What is your assignment?</Label>
          <Input type="text" name="assignment" id="assignment" placeholder="Put your assignment here" />
        </FormGroup>
        <FormGroup>
        <Label for="total">How long would you like to spend on the assignment in total?</Label>
          <Input type="text" name="total" id="total" placeholder="Put your planned amount of time here" />
        </FormGroup>
        <FormGroup>
          <Label for="exampleSelect">How long do you want each session to be?</Label>
          <Input type="select" name="select" id="exampleSelect">
            <option>1 Hour</option>
            <option>2 Hour</option>
            <option>3 Hour</option>
            <option>4 Hour</option>
            <option>5 Hour</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="deadline">When is your deadline?</Label>
          <DatePicker id="example-datepicker" value={this.state.value} onChange={this.handleChange} />
        </FormGroup>
      </Form>
      </div>
    );
  }
}

export default Questions;