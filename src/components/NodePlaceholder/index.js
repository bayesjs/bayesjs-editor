import React from 'react';

const NodePlaceholder = props => (
  <rect
    {...props}
    fill="none"
    stroke="#333"
    strokeWidth="2"
    strokeDasharray="5,5"
  />
);

export default NodePlaceholder;
