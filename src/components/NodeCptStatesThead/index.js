import React from 'react';
import { statePropTypes } from 'models';
import PropTypes from 'prop-types';

const NodeCptStatesThead = ({ states }) => (
  <thead>
    <tr>
      {states.map(state => (
        <th key={state}>{state}</th>
      ))}
    </tr>
  </thead>
);

NodeCptStatesThead.propTypes = {
  states: PropTypes.arrayOf(statePropTypes).isRequired,
};

export default NodeCptStatesThead;
