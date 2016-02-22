import React, { Component } from 'react';
import Board from './Board';
import ConditionalProbabilityTable from './ConditionalProbabilityTable';

class App extends Component {
  render() {
    return (
      <div>
        <Board />
        <ConditionalProbabilityTable />
      </div>
    );
  }
}

export default App;
