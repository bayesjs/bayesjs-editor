import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import styles from './Node.css';

const nodeSource = {
  beginDrag(props) {
    return { id: props.id };
  }
};

const collect = (connector, monitor) => ({
  connectDragSource: connector.dragSource()
});

@DragSource('node', nodeSource, collect)
export default class Node extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    connectDragSource: PropTypes.func.isRequired
  };

  render() {
    const { id, left, top, connectDragSource } = this.props;

    return connectDragSource(
      <div
        className={styles.node}
        style={{ left, top }}
      >
        {id}
      </div>
    );
  }
}
