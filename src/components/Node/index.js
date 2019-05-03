import { nodePosition, sizePropTypes, statesPropTypes } from 'models';

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
};

Node.propTypes = {
  id: PropTypes.string.isRequired,
  states: statesPropTypes.isRequired,
  results: PropTypes.objectOf(PropTypes.number).isRequired,
  isSelected: PropTypes.bool.isRequired,
  belief: PropTypes.string,
  onMouseDown: PropTypes.func.isRequired,
  onStateDoubleClick: PropTypes.func.isRequired,
  position: nodePosition.isRequired,
  size: sizePropTypes.isRequired,
  description: PropTypes.string,
};

export default Node;
