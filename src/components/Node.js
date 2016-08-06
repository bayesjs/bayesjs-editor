import React, { Component, PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  node: {
    cursor: 'move',
    userSelect: 'none',
  },
});

class Node extends Component {
  renderState = (state, index) => (
    <text key={state} x="5" y={37 + (18 * index)}>
      <tspan>{state}</tspan>
      <tspan x="155" textAnchor="end">
        {this.props.results[state].toFixed(2)}
      </tspan>
    </text>
  );

  render() {
    return (
      <g
        className={css(styles.node)}
        onMouseDown={this.props.onMouseDown}
        transform={`translate(${this.props.x} ${this.props.y})`}
      >
        <rect
          height={20 + (20 * this.props.states.length)}
          width="160"
          fill="#ff8"
          stroke="#333"
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
  rectRef: PropTypes.func,
  onMouseDown: PropTypes.func,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Node;
