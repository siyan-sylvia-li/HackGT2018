import React from 'react';
import { Scheduler } from '@progress/kendo-scheduler-react-wrapper';

class Daily extends React.Component {
  render() {
    return (
      <div className = "Daily">
          <h3> What is your daily routine like?</h3>
           <Scheduler change={this.onChange}
                    dataBound={this.dataBound}
                    dataSource={this.events}
                    date={this.date}/>
      </div>
    );
  }
}

export default Daily;