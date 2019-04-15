import PropTypes from 'prop-types';
import React from 'react';
import { getComponentTestId } from '../../utils/test-utils';
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
  stroke,
  canMove,
  opacity,
  children,
}) => (
  <g
    className={styles.node}
    onMouseDown={onMouseDown}
    onDoubleClick={onDoubleClick}
    transform={`translate(${x} ${y})`}
    style={{
      cursor: (canMove ? 'nove' : 'pointer'),
    }}
    data-testid={getComponentTestId('NodeGeneric', id)}
  >
    <rect
      height={25 + (sumHeight || 0)}
      width="160"
      fill={stroke}
      fillOpacity={opacity}
      stroke="#333"
      strokeWidth={selected ? 3 : 1}
      ref={rectRef}
    />

    <foreignObject x="5" y="0" height="15" width="150">
      <p
        title={id}
        style={{
          margin: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
        data-testid={getComponentTestId('NodeGeneric', 'Title')}
      >
        {id}
      </p>
    </foreignObject>

    <path d="M0,20 h160" stroke="#333" />

    {children}
  </g>
);

NodeGeneric.defaultProps = {
  children: null,
  sumHeight: 0,
  onDoubleClick: () => {},
  stroke: '#ff8',
  canMove: false,
  opacity: '1',
};

NodeGeneric.propTypes = {
  id: PropTypes.string.isRequired,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  selected: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  rectRef: PropTypes.func.isRequired,
  sumHeight: PropTypes,
  children: PropTypes.element,
  onDoubleClick: PropTypes.func,
  stroke: PropTypes.string,
  canMove: PropTypes.bool,
  opacity: PropTypes.string,
};

export default NodeGeneric;
