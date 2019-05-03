import { positionPropTypes, sizePropTypes, statePropTypes } from 'models';

import GenericNode from 'components/GenericNode';
import NodeConnections from 'components/NodeConnections';
import NodeStates from 'components/NodeStates';
import PropTypes from 'prop-types';
import React from 'react';

const Node = props => (
  <GenericNode {...props}>
    <NodeStates {...props} />
    <NodeConnections {...props} />
  </GenericNode>
);

Node.defaultProps = {
  belief: null,
  description: null,
  states: null,
  results: {},
  isSelected: false,
};

Node.propTypes = {
  id: PropTypes.string.isRequired,
  states: PropTypes.arrayOf(statePropTypes),
  results: PropTypes.objectOf(PropTypes.number),
  isSelected: PropTypes.bool,
  belief: PropTypes.string,
  onMouseDown: PropTypes.func.isRequired,
  onStateDoubleClick: PropTypes.func.isRequired,
  position: positionPropTypes.isRequired,
  size: sizePropTypes.isRequired,
  description: PropTypes.string,
};

export default Node;
