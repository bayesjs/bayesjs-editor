import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { moveNode } from '../actions/nodes';
import Node from '../components/Node';
import styles from './Board.css';

const boardTarget = {
  drop(props, monitor, component) {
    const { dispatch } = props;
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();

    dispatch(moveNode(item.id, delta.x, delta.y));
  }
};

const collect = (connector, monitor) => ({
  connectDropTarget: connector.dropTarget()
});

const mapStateToProps = state => ({
  nodes: state.nodes
});

@connect(mapStateToProps)
@DropTarget('node', boardTarget, collect)
export default class Board extends Component {
  static propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.object),
    connectDropTarget: PropTypes.func.isRequired
  };

  render() {
    const { connectDropTarget, nodes } = this.props;

    return connectDropTarget(
      <div className={styles.board}>
        {nodes.map(this.renderNode)}
      </div>
    );
  }

  renderNode(node) {
    return (
      <Node
        key={node.id}
        id={node.id}
        left={node.left}
        top={node.top}
      />
    );
  }
}
