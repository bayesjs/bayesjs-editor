import PropTypes from 'prop-types';
import React from 'react';
import NodeGeneric from '../NodeGeneric';
import NodeState from '../NodeState';
import { statesPropTypes } from '../../models';

const Node = (props) => {
  const {
    id, states, children, sumHeight,
  } = props;

  const propsGeneric = {
    ...props,
    sumHeight: (18 * states.length) + (sumHeight || 0),
  };

  const renderState = (state, index) => {
    const tempProps = {
      ...props,
      state,
      index,
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
      {states.map(renderState)}
      {children}
    </NodeGeneric>
  );
};

Node.defaultProps = {
  children: null,
  belief: null,
  rectRef: () => {},
  sumHeight: 0,
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
  sumHeight: PropTypes.number,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Node;
