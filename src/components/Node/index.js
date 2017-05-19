import React, { PropTypes } from 'react';
import NodeGeneric from '../NodeGeneric';
import NodeState from '../NodeState';

const Node = (props) => {
  const { id, states, children, sumHeight } = props;
  
  const propsGeneric = {
    ...props,
    sumHeight: (18 * states.length) + (sumHeight || 0)
  };
  
  const renderState = (state, index) => {
    const tempProps = {
      ...props,
      state,
      index
    };
    return (
      <NodeState 
        key={`${id}-${state}-${index}`}
        {...tempProps}
        />
    );
  };

  return (
    <NodeGeneric
      {...propsGeneric}
    >
      {props.states.map(renderState)}
      {children}
    </NodeGeneric>
  );
};


Node.propTypes = {
  id: PropTypes.string.isRequired,
  states: PropTypes.arrayOf(PropTypes.string).isRequired,
  results: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  belief: PropTypes.string,
  rectRef: PropTypes.func,
  onMouseDown: PropTypes.func.isRequired,
  onStateDoubleClick: PropTypes.func.isRequired,
  sumHeight: PropTypes.number,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Node;
