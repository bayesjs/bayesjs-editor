import React from 'react';
import { positionPropTypes } from '@models';

const ArrowPlaceholder = ({ from, to }) => (
  <path
    d={`M${from.x},${from.y} ${to.x},${to.y}`}
    fill="none"
    stroke="#333"
    strokeWidth="2"
    strokeDasharray="5,5"
    markerEnd="url(#triangle)"
  />
);

ArrowPlaceholder.propTypes = {
  from: positionPropTypes.isRequired,
  to: positionPropTypes.isRequired,
};

export default ArrowPlaceholder;
