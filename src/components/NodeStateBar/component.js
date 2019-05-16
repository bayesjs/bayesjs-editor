import React, { Fragment } from 'react';

import PropTypes from 'prop-types';

const NodeStateBar = ({
  barWidth,
  fillColor,
  percentText,
  x,
  textX,
  textY,
  barX,
  barY,
  height,
  width,
  onDoubleClick,
}) => (
  <Fragment>
    <rect
      x={barX}
      y={barY}
      height={height}
      width={barWidth}
      fill={fillColor}
    />

    <text
      x={textX}
      y={textY}
      height={height}
      fontSize="14px"
      alignmentBaseline="rigth"
      stroke="black"
      strokeWidth="1.1"
    >
      {percentText}
    </text>

    <rect
      x={x}
      y={barY}
      height={height}
      width={width}
      fill="transparent"
      stroke="#333"
      strokeWidth="1"
      onDoubleClick={onDoubleClick}
    >
      <title>
        {percentText}
      </title>
    </rect>
  </Fragment>
);

NodeStateBar.propTypes = {
  barWidth: PropTypes.number.isRequired,
  fillColor: PropTypes.string.isRequired,
  percentText: PropTypes.string.isRequired,
  textX: PropTypes.number.isRequired,
  textY: PropTypes.number.isRequired,
  barX: PropTypes.number.isRequired,
  barY: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};

export default NodeStateBar;
