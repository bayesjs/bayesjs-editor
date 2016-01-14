import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import Node from '../components/Node';
import styles from './Board.css';

const boardTarget = {
  drop(props, monitor, component) {
    const delta = monitor.getDifferenceFromInitialOffset();

    component.moveNode(delta.x, delta.y);
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
});

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = { left: 50, top: 50 };
  }

  moveNode(differenceLeft, differenceTop) {
    const { left, top } = this.state;

    this.setState({
      left: Math.round(left + differenceLeft),
      top: Math.round(top + differenceTop)
    });
  }

  render() {
    const { connectDropTarget } = this.props;
    const { left, top } = this.state;

    return connectDropTarget(
      <div className={styles.board}>
        <Node left={left} top={top} id="RAIN" />
      </div>
    );
  }
}

export default DropTarget('node', boardTarget, collect)(Board);
