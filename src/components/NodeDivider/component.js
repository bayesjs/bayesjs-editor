import React from 'react';
import PropTypes from 'prop-types';

const NodeDivider = ({ y, width }) => (
  <path d={`M0,${y} h${width}`} stroke="#333" />
);

NodeDivider.propTypes = {
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default NodeDivider;
