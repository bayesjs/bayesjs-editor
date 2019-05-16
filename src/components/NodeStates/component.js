import React from 'react';
import NodeState from 'components/NodeState';

const NodeStates = ({
  id,
  states,
  stateHeight,
  stateWidth,
  ...props
}) =>
  states.map((state, index) => (
    <NodeState
      key={`${id}-${state}`}
      state={state}
      index={index}
      height={stateHeight}
      width={stateWidth}
      {...props}
    />
  ));

export default NodeStates;
