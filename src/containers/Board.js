import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { initDrag, updateDragPosition, endDrag } from '../actions/drag';
import { moveNode } from '../actions/nodes';
import Node from '../components/Node';
import { getEllipseNearestPoint } from '../modules/geometry';

const nodeRadius = {
  x: 70,
  y: 40
};

class Board extends Component {
  static propTypes = {
    nodes: PropTypes.array.isRequired,
    drag: PropTypes.object.isRequired,
    moveNode: PropTypes.func.isRequired,
    initDrag: PropTypes.func.isRequired,
    updateDragPosition: PropTypes.func.isRequired,
    endDrag: PropTypes.func.isRequired
  };

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
        height="400"
        width="600"
        style={{ border: 'solid 1px black' }}
        onMouseMove={e => this.handleMouseMove(e)}
        onMouseUp={e => this.handleMouseUp(e)}
      >
        {/*
          React is ignoring some SVG attrs. It'll be solved in 0.15.
          Until then, we must use 'dangerouslySetInnerHTML'.
          Check: https://github.com/facebook/react/issues/5763.
        */}
        <defs dangerouslySetInnerHTML={{ __html: `
          <marker
            id="triangle"
            viewBox="0 0 10 10"
            refX="1" refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        ` }}
        />
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
        radiusX={nodeRadius.x}
        radiusY={nodeRadius.y}
        onMouseDown={e => this.handleNodeMouseDown(node.id, e)}
      />
    );
  }

  renderLines(node) {
    return node.parents.map(parentId => {
      const parentPoint = this.calculateNodePosition(parentId);
      const childPoint = this.calculateNodePosition(node.id);
      const nearestPointFromParent = getEllipseNearestPoint(
        childPoint.left, childPoint.top,
        nodeRadius.x + 10, nodeRadius.y + 10,
        parentPoint.left, parentPoint.top
      );

      return (
        <line
          key={`${parentId}->${node.id}`}
          x1={parentPoint.left} y1={parentPoint.top}
          x2={Math.round(nearestPointFromParent.x)}
          y2={Math.round(nearestPointFromParent.y)}
          stroke="black" strokeWidth="2"
          markerEnd="url(#triangle)"
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

const mapStateToProps = state => ({
  nodes: state.nodes,
  drag: state.drag
});

export default connect(
  mapStateToProps,
  { initDrag, updateDragPosition, endDrag, moveNode }
)(Board);
