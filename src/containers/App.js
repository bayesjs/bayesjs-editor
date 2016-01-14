import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Board from './Board';

@DragDropContext(HTML5Backend)
export default class App extends Component {
  render() {
    return <Board />;
  }
}
