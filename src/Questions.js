import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';

class Questions extends React.Component {
  render() {
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
        </FormGroup>
      </Form>
      </div>
    );
  }
}

export default Questions;