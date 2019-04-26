import PropTypes from 'prop-types';
import React from 'react';
import { getComponentTestId } from 'utils/test-utils';
import styles from './styles.css';
import { nodePosition, nodeSize } from '../../models';

const NodeGeneric = ({
  id,
  position,
  size,
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
    transform={`translate(${position.x} ${position.y})`}
    style={{
      cursor: (canMove ? 'nove' : 'pointer'),
    }}
    data-testid={getComponentTestId('NodeGeneric', id)}
  >
    <rect
      height={size.height}
      width={size.width}
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
  onDoubleClick: () => { },
  stroke: '#ff8',
  canMove: false,
  opacity: '1',
};

NodeGeneric.propTypes = {
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  rectRef: PropTypes.func.isRequired,
  position: nodePosition.isRequired,
  size: nodeSize.isRequired,
  children: PropTypes.element,
  onDoubleClick: PropTypes.func,
  stroke: PropTypes.string,
  canMove: PropTypes.bool,
  opacity: PropTypes.string,
};

export default NodeGeneric;
