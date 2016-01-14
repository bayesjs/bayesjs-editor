import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { initDrag, updateDragPosition, endDrag } from '../actions/drag';
import { moveNode } from '../actions/nodes';
import Node from '../components/Node';

const mapStateToProps = state => ({
  nodes: state.nodes,
  drag: state.drag
});

@connect(
  mapStateToProps,
  { initDrag, updateDragPosition, endDrag, moveNode }
)
export default class Board extends Component {
  handleNodeMouseDown(nodeId, e) {
    this.props.initDrag(nodeId, e.clientX, e.clientY);
  }

  handleMouseMove(e) {
    if (this.props.drag.draggingNodeId === null) {
      return;
    }

    this.props.updateDragPosition(e.clientX, e.clientY);
  }

  handleMouseUp(e) {
    if (this.props.drag.draggingNodeId === null) {
      return;
    }

    const { draggingNodeId, differenceFromInitialPosition } = this.props.drag;

    this.props.moveNode(
      draggingNodeId,
      differenceFromInitialPosition.x,
      differenceFromInitialPosition.y
    );

    this.props.endDrag();
  }

  render() {
    const { nodes } = this.props;

    return (
      <svg
        height="300"
        width="500"
        style={{ border: 'solid 1px black' }}
        onMouseMove={e => this.handleMouseMove(e)}
        onMouseUp={e => this.handleMouseUp(e)}
      >
        {nodes.map(node => this.renderLines(node))}
        {nodes.map(node => this.renderNode(node))}
      </svg>
    );
  }

  renderNode(node) {
    const nodePosition = this.calculateNodePosition(node.id);

    return (
      <Node
        key={node.id}
        id={node.id}
        left={nodePosition.left}
        top={nodePosition.top}
        onMouseDown={e => this.handleNodeMouseDown(node.id, e)}
      />
    );
  }

  renderLines(node) {
    return node.parents.map(parentId => {
      const p1 = this.calculateNodePosition(node.id);
      const p2 = this.calculateNodePosition(parentId);
      return (
        <line
          key={`${parentId}->${node.id}`}
          x1={p1.left} y1={p1.top}
          x2={p2.left} y2={p2.top}
          stroke="black" strokeWidth="2"
        />
      );
    });
  }

  calculateNodePosition(nodeId) {
    const node = this.findNode(nodeId);
    const { draggingNodeId, differenceFromInitialPosition } = this.props.drag;
    let { left, top } = node;

    if (draggingNodeId === nodeId) {
      left += differenceFromInitialPosition.x;
      top += differenceFromInitialPosition.y;
    }

    return { left, top };
  }

  findNode(nodeId) {
    return this.props.nodes.find(n => n.id === nodeId);
  }
}
