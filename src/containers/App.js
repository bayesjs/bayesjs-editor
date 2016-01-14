import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Board from './Board';

class App extends Component {
  render() {
    return <Board />;
  }
}

export default DragDropContext(HTML5Backend)(App);
