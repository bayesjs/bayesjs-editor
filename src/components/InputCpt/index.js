import React, { PropTypes } from 'react';

const InputCpt = (props) => (
  <input
    type="number"
    step="0.01"
    max="1"
    min="0"
    { ...props }
  />
);

export default InputCpt;
