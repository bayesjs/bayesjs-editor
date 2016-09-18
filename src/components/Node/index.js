import React, { Component, PropTypes } from 'react';
import styles from './styles.css';

class Node extends Component {
  renderState = (state, index) => {
    const result = this.props.results[state];
    const percent = 100 * result;
    const barWidth = 70 * result;

    return (
      <g key={state}>
        <text x="5" y={37 + (18 * index)}>
          {state}
        </text>
        <rect
          x="85"
          y={24 + (18 * index)}
          height="15"
          width="70"
          fill="transparent"
          stroke="#333"
          strokeWidth="1"
        >
          <title>{percent.toFixed(2)}%</title>
        </rect>
        <rect
          x={155 - barWidth}
          y={24 + (18 * index)}
          height="15"
          width={barWidth}
          fill="#333"
        >
          <title>{percent.toFixed(2)}%</title>
        </rect>
      </g>
    );
  };

  render() {
    return (
      <g
        className={styles.node}
        onMouseDown={this.props.onMouseDown}
        transform={`translate(${this.props.x} ${this.props.y})`}
      >
        <rect
          height={25 + (18 * this.props.states.length)}
          width="160"
          fill="#ff8"
          stroke="#333"
          strokeWidth={this.props.selected ? 3 : 1}
          ref={this.props.rectRef}
        />

        <text x="5" y="15">{this.props.id}</text>
        <path d="M0,20 h160" stroke="#333" />

        {this.props.states.map(this.renderState)}
      </g>
    );
  }
}

Node.propTypes = {
  id: PropTypes.string.isRequired,
  states: PropTypes.arrayOf(PropTypes.string).isRequired,
  results: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  rectRef: PropTypes.func,
  onMouseDown: PropTypes.func,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Node;
