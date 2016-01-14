import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import styles from './Node.css';

const nodeSource = {
  beginDrag(props) {
    return { id: props.id };
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource()
});

class Node extends Component {
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

Node.propTypes = {
  id: PropTypes.string.isRequired,
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

export default DragSource('node', nodeSource, collect)(Node);
