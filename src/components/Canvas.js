import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import Node from './Node';

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    display: 'flex',
    background: '#ccc',
    overflow: 'auto',
  },
  container: {
    flexShrink: 0,
    margin: 'auto',
  },
  canvas: {
    border: 'solid 1px #333',
    backgroundColor: '#fcfcfc',
    boxShadow: '0px 0px 20px #333',
    margin: 10,
  },
});

const nodes = [
  { id: 'RAIN', states: ['T', 'F'], position: { x: 70, y: 50 } },
  { id: 'SPRINKLER', states: ['T', 'F'], position: { x: 270, y: 80 } },
  { id: 'GRASS_WET', states: ['T', 'F'], position: { x: 200, y: 230 } },
];

class Canvas extends Component {
  movingNode = null;

  handleNodeMouseDown = (node, e) => {
    this.movingNode = {
      id: node.id,
      initialPosition: {
        x: node.position.x,
        y: node.position.y,
      },
      initialMousePosition: {
        x: e.clientX,
        y: e.clientY,
      },
    };
  };

  handleMouseMove = e => {
    if (this.movingNode == null) {
      return;
    }

    const { id, initialPosition, initialMousePosition } = this.movingNode;

    const difX = e.clientX - initialMousePosition.x;
    const difY = e.clientY - initialMousePosition.y;

    const newX = initialPosition.x + difX;
    const newY = initialPosition.y + difY;

    nodes.find(x => x.id === id).position = {
      x: newX,
      y: newY,
    };

    this.forceUpdate();
  };

  handleMouseUpOrLeave = () => {
    this.movingNode = null;
  };

  renderNode = node => (
    <Node
      key={node.id}
      id={node.id}
      onMouseDown={e => this.handleNodeMouseDown(node, e)}
      states={node.states}
      x={node.position.x}
      y={node.position.y}
    />
  );

  render() {
    return (
      <div className={css(styles.scroll)}>
        <div className={css(styles.container)}>
          <svg
            className={css(styles.canvas)}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUpOrLeave}
            onMouseLeave={this.handleMouseUpOrLeave}
            height="400"
            width="600"
          >
            {nodes.map(this.renderNode)}
          </svg>
        </div>
      </div>
    );
  }
}

export default Canvas;
