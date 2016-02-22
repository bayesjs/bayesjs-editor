import React, { Component, PropTypes } from 'react';

class Node extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    radiusX: PropTypes.number.isRequired,
    radiusY: PropTypes.number.isRequired,
    selected: PropTypes.bool,
    onMouseDown: PropTypes.func.isRequired
  };

  render() {
    const {
      id,
      left,
      top,
      radiusX,
      radiusY,
      selected,
      onMouseDown
    } = this.props;

    return (
      <g
        style={{ cursor: 'move' }}
        onMouseDown={e => onMouseDown(e)}
      >
        <ellipse
          cx={left} cy={top}
          rx={radiusX} ry={radiusY}
          fill="#ffc" stroke="black"
          strokeWidth={selected ? 3 : 1}
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

export default Node;
