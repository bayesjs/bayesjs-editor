import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getInferenceEnabled } from '../../selectors';

const getResult = (results, state, belief) => {
  if (belief !== null) {
    return belief === state ? 1 : 0;
  }

  return results[state];
};

const getTextX = (result) => {
  if (result === 1) return 97;
  if (result >= 0.1) return 100;

  return 103;
};

const NodeState = ({
  belief,
  results,
  state,
  onStateDoubleClick,
  index,
}) => {
  const result = getResult(results, state, belief);
  const percent = 100 * result;
  const barWidth = 70 * result;
  const fillColor = belief != null ? '#EE4040' : '#9f9ff6';

  return (
    <g>
      <foreignObject x="5" y={21 + (18 * index)} height="15" width="75">
        <p
          title={state}
          style={{
            margin: 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {state}
        </p>
      </foreignObject>

      <rect
        x={155 - barWidth}
        y={24 + (18 * index)}
        height="15"
        width={barWidth}
        fill={fillColor}
      />

      <text
        x={getTextX(result)}
        y={36 + (18 * index)}
        height="15"
        fontSize="14px"
        alignmentBaseline="rigth"
        stroke="black"
        strokeWidth="1.1"
      >
        {`${percent.toFixed(2)} %`}
      </text>
      <rect
        x="85"
        y={24 + (18 * index)}
        height="15"
        width="70"
        fill="transparent"
        stroke="#333"
        strokeWidth="1"
        onDoubleClick={() => onStateDoubleClick(state)}
      >
        <title>
          {percent.toFixed(2)}
%
        </title>
      </rect>
    </g>
  );
};

NodeState.defaultProps = {
  belief: null,
};

NodeState.propTypes = {
  results: PropTypes.objectOf(PropTypes.number).isRequired,
  state: PropTypes.string.isRequired,
  onStateDoubleClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  belief: PropTypes.string,
};

const mapStateToProps = state => ({
  inferenceEnabled: getInferenceEnabled(state),
});

export default connect(mapStateToProps)(NodeState);
