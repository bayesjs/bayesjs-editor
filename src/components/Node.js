import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  node: {
    cursor: 'move',
  },
});

const renderState = (state, index) => (
  <text key={state} x="5" y={37 + (18 * index)}>
    <tspan>{state}</tspan>
    <tspan x="155" textAnchor="end">99.9</tspan>
  </text>
);

const Node = props => (
  <g
    className={css(styles.node)}
    onMouseDown={props.onMouseDown}
    transform={`translate(${props.x} ${props.y})`}
  >
    <rect
      height={20 + (20 * props.states.length)}
      width="160"
      fill="#ff8"
      stroke="#333"
      ref={props.rectRef}
    />

    <text x="5" y="15">{props.id}</text>
    <path d="M0,20 h160" stroke="#333" />

    {props.states.map(renderState)}
  </g>
);

Node.propTypes = {
  id: PropTypes.string.isRequired,
  states: PropTypes.arrayOf(PropTypes.string).isRequired,
  rectRef: PropTypes.func,
  onMouseDown: PropTypes.func,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Node;
