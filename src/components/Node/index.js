import PropTypes from 'prop-types';
import React from 'react';
import { nodePosition, nodeSize, statesPropTypes } from 'models';
import NodeState from '../NodeState';
import NodeGeneric from '../NodeGeneric';

const renderState = ({ id, ...props }) => (state, index) => {
  const finalProps = { ...props, state, index };

  return (
    <NodeState
      key={`${id}-${state}`}
      {...finalProps}
    />
  );
};

const Node = ({
  states,
  children,
  ...props
}) => (
  <NodeGeneric {...props}>
    {states.map(renderState(props))}
    {children}
  </NodeGeneric>
);

Node.defaultProps = {
  children: null,
  belief: null,
  rectRef: () => { },
};

Node.propTypes = {
  id: PropTypes.string.isRequired,
  states: statesPropTypes.isRequired,
  children: PropTypes.element,
  results: PropTypes.objectOf(PropTypes.number).isRequired,
  selected: PropTypes.bool.isRequired,
  belief: PropTypes.string,
  rectRef: PropTypes.func,
  onMouseDown: PropTypes.func.isRequired,
  onStateDoubleClick: PropTypes.func.isRequired,
  position: nodePosition.isRequired,
  size: nodeSize.isRequired,
};

export default Node;
