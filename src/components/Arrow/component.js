import React from 'react';
import { omit } from 'ramda';
import { noop } from 'lodash';

import PropTypes from 'prop-types';
import { getComponentTestId } from 'utils/test-utils';
import { positionPropTypes } from 'models';

const style = {
  transition: 'stroke-opacity 0.2s',
};
const stylePath = { cursor: 'pointer' };
const omitProps = omit(['markEnd', 'markEndStyle']);

const Arrow = ({
  title,
  markerEnd,
  pathD,
  onMouseOver,
  onMouseLeave,
  ...props
}) => (
  <g
    style={style}
    onMouseOver={onMouseOver}
    onFocus={onMouseOver}
    onMouseLeave={onMouseLeave}
    onBlur={onMouseLeave}
    data-testid={getComponentTestId('Arrow')}
    {...omitProps(props)}
  >
    <path
      d={pathD}
      fill="none"
      stroke="#333"
      strokeWidth="2"
      markerEnd={markerEnd}
      style={stylePath}
    >
      {title}
    </path>
  </g>
);

Arrow.defaultProps = {
  markEndStyle: '',
  onMouseOver: noop,
  onMouseLeave: noop,
  strokeOpacity: null,
};

Arrow.propTypes = {
  from: PropTypes.objectOf(positionPropTypes).isRequired,
  to: PropTypes.objectOf(positionPropTypes).isRequired,
  onMouseDown: PropTypes.func.isRequired,
  markEnd: PropTypes.bool.isRequired,
  markEndStyle: PropTypes.string,
  markerEnd: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onMouseOver: PropTypes.func,
  onMouseLeave: PropTypes.func,
  pathD: PropTypes.string.isRequired,
  strokeOpacity: PropTypes.string,
};

export default Arrow;
