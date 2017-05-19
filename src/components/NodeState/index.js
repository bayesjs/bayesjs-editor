import React, { PropTypes } from 'react';

const NodeState = ({
  belief,
  results,
  state,
  onStateDoubleClick,
  index,
}) => {
  let result;

  if (belief != null) {
    result = belief === state ? 1 : 0;
  } else {
    result = results[state];
  }

  const percent = 100 * result;
  const barWidth = 70 * result;
  const fillColor = belief != null ? '#EE4040' : '#4040EE';

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
      
      <text x="105" y={35 + (18 * index)} height="15" fontSize="12px" stroke="red">{`${percent.toFixed(2)} %`}</text>
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
        <title>{percent.toFixed(2)}%</title>
      </rect>
    </g>
  )
};

NodeState.prototype = {
  children: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired,
  state: PropTypes.string.isRequired,
  onStateDoubleClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
}

export default NodeState;