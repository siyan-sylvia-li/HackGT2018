import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

class Item extends React.Component {
  constructor(props) {
    super(props);
    // this.handleChange = this.handleChange.bind(this);
    this.handleAct = this.handleAct.bind(this);
    this.handleBegin = this.handleBegin.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.state = {
      events: [],
    };
  }

  handleAct(e) {
    this.props.handleAct(e.target.value);
  }

  handleBegin(e) {
    this.props.handleBegin(e.toString());
  }

  handleEnd(e) {
    this.props.handleEnd(e.toString());
  }
  render() {
    return (
      <div>
        <Input type="text" name="name" id="name" placeholder="Name of Activity" 
            onChange={this.handleAct}/>
        <p>From <TimePicker defaultValue={moment()} showSecond={false} minuteStep={30} onChange={this.handleBegin}/>  To <TimePicker defaultValue={moment()} minuteStep={30} showSecond={false} onChange={this.handleEnd}/> </p>
      </div>
    );
  }
  // Date as well
}

export default Item;