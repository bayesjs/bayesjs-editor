import { positionPropTypes, sizePropTypes } from 'models';

import NodeDivider from 'components/NodeDivider';
import PropTypes from 'prop-types';
import React from 'react';
import SvgText from 'components/SvgText';
import { getComponentTestId } from 'utils/test-utils';
import { noop } from 'lodash';
import styles from './styles.css';

const GenericNode = ({
  id,
  name,
  description,
  position,
  size,
  isSelected,
  onMouseDown,
  onDoubleClick,
  stroke,
  style,
  opacity,
  textX,
  textY,
  textHeight,
  textWidth,
  descriptionX,
  descriptionY,
  descriptionHeight,
  descriptionWidth,
  showDescription,
  children,
}) => (
  <g
    className={styles.node}
    onMouseDown={onMouseDown}

    onDoubleClick={onDoubleClick}
    transform={`translate(${position.x} ${position.y})`}
    style={style}
    data-testid={getComponentTestId('GenericNode', id)}
  >
    <rect
      height={size.height}
      width={size.width}
      fill={stroke}
      fillOpacity={opacity}
      stroke="#333"
      strokeWidth={isSelected ? 3 : 1}
    />
    <SvgText
      text={name}
      x={textX}
      y={textY}
      height={textHeight}
      width={textWidth}
    />

    <NodeDivider y={20} width={size.width} />

    {showDescription && (
      <SvgText
        text={description}
        x={descriptionX}
        y={descriptionY}
        height={descriptionHeight}
        width={descriptionWidth}
      />
    )}
    {children}
  </g>
);

GenericNode.defaultProps = {
  children: null,
  onDoubleClick: noop,
  stroke: '#ff8',
  canMove: false,
  opacity: '1',
  description: null,
};

GenericNode.propTypes = {
  id: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  position: positionPropTypes.isRequired,
  size: sizePropTypes.isRequired,
  children: PropTypes.node,
  onDoubleClick: PropTypes.func,
  stroke: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  canMove: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object.isRequired,
  opacity: PropTypes.string,
  name: PropTypes.string.isRequired,
  textX: PropTypes.number.isRequired,
  textY: PropTypes.number.isRequired,
  textHeight: PropTypes.number.isRequired,
  textWidth: PropTypes.number.isRequired,
  description: PropTypes.string,
  descriptionX: PropTypes.number.isRequired,
  descriptionY: PropTypes.number.isRequired,
  descriptionHeight: PropTypes.number.isRequired,
  descriptionWidth: PropTypes.number.isRequired,
  showDescription: PropTypes.bool.isRequired,
};

export default GenericNode;
