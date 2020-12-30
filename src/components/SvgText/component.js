import PropTypes from 'prop-types';
import React from 'react';
import { getComponentTestId } from '@utils/test-utils';

const style = {
  margin: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const SvgText = ({
  text,
  x,
  y,
  height,
  width,
}) => (
  <foreignObject
    x={x}
    y={y}
    height={height}
    width={width}
    data-testid={getComponentTestId('SvgText')}
  >
    <p
      title={text}
      style={style}
    >
      {text}
    </p>
  </foreignObject>
);

SvgText.propTypes = {
  text: PropTypes.string.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

SvgText.defaultProps = {
  x: 0,
  y: 0,
};

export default SvgText;
