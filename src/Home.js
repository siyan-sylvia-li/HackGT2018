import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Home extends React.Component {
  render() {
    return (
      <div className = "Home">
        <div className = "Text1">
          <h1> Welcome to the Scheduling App!</h1>
          <h3> Before we start, we would like to know a few things about you... </h3>
        </div>
      </div>
    )
  }
}

export default Home;