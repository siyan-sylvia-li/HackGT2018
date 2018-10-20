import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Questions extends React.Component {
  render() {
    return (
      <div className = "Questions">
          <p> What is your assignment? </p>
          <input type="text" name="name" />
      </div>
    )
  }
}

export default Questions;