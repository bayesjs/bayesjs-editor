import NodeStateBar from '@components/NodeStateBar';
import PropTypes from 'prop-types';
import React from 'react';
import SvgText from '@components/SvgText';
import { getComponentTestId } from '@utils/test-utils';

const NodeState = ({
  state,
  onStateDoubleClick,
  results,
  belief,
  y,
  height,
  textX,
  barX,
  textWidth,
  barWidth,
}) => (
  <g data-testid={getComponentTestId('NodeState', state)}>
    <SvgText
      text={state}
      x={textX}
      y={y}
      height={height}
      width={textWidth}
    />

    <NodeStateBar
      x={barX}
      y={y}
      width={barWidth}
      height={height}
      results={results}
      state={state}
      belief={belief}
      onDoubleClick={onStateDoubleClick(state)}
    />
  </g>
);

NodeState.defaultProps = {
  belief: null,
};

NodeState.propTypes = {
  results: PropTypes.objectOf(PropTypes.number).isRequired,
  state: PropTypes.string.isRequired,
  onStateDoubleClick: PropTypes.func.isRequired,
  belief: PropTypes.string,
  y: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  textX: PropTypes.number.isRequired,
  barX: PropTypes.number.isRequired,
  textWidth: PropTypes.number.isRequired,
  barWidth: PropTypes.number.isRequired,
};

export default NodeState;
