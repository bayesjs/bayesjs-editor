import React, { Component, PropTypes } from 'react';

export default class Node extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    onMouseDown: PropTypes.func.isRequired
  };

  render() {
    const { id, left, top, onMouseDown } = this.props;

    return (
      <g
        style={{ cursor: 'move' }}
        onMouseDown={e => onMouseDown(e)}
      >
        <ellipse
          cx={left} cy={top} rx="70" ry="40"
          fill="#ffc" stroke="black"
        />
        <text
          x={left} y={top}
          textAnchor="middle" dy="5"
        >
          {id}
        </text>
      </g>
    );
  }
}
