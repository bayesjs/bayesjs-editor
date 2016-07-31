import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  node: {
    cursor: 'move',
  },
});

const Node = props => (
  <g
    transform={`translate(${props.x} ${props.y})`}
    className={css(styles.node)}
  >
    <rect
      height={20 + (20 * 2)}
      width="160"
      fill="#ff8"
      stroke="#333"
    />

    <text x="5" y="15">NODE</text>
    <path d="M0,20 h160" stroke="#333" />

    <text x="5" y="37">
      <tspan>True</tspan>
      <tspan x="155" textAnchor="end">95.1</tspan>
    </text>

    <text x="5" y="55">
      <tspan>False</tspan>
      <tspan x="155" textAnchor="end">4.9</tspan>
    </text>
  </g>
);

Node.propTypes = {
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Node;
