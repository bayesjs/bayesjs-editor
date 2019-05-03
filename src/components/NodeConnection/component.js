import React from 'react';
import PropTypes from 'prop-types';

const NodeConnection = ({
  name,
  cx,
  cy,
  color,
}) => (
  <circle cx={cx} cy={cy} r="8" fill={color}>
    <title>{`Rede: ${name}`}</title>
  </circle>
);

NodeConnection.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
};

export default NodeConnection;
