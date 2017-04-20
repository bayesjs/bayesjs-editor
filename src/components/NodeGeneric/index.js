import React, { PropTypes } from 'react';
import styles from './styles.css';

const NodeGeneric = ({
  id,
  x, 
  y,
  sumHeight,
  selected,
  onMouseDown,
  rectRef,
  onDoubleClick,
  children
}) => (
  <g
    className={styles.node}
    onMouseDown={onMouseDown}
    onDoubleClick={onDoubleClick}
    transform={`translate(${x} ${y})`}
  >
    <rect
      height={25 + (sumHeight || 0)}
      width="160"
      fill="#ff8"
      stroke="#333"
      strokeWidth={selected ? 3 : 1}
      ref={rectRef}
    />

    <text x="5" y="15">{id}</text>
    <path d="M0,20 h160" stroke="#333" />

    {children}
  </g>
);

NodeGeneric.prototype = {
  id: PropTypes.string.isRequired,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  selected: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  rectRef: PropTypes.func.isRequired,
}

export default NodeGeneric;