import { addIndex, map } from 'ramda';

import NodeConnection from 'components/NodeConnection';
import NodeDivider from 'components/NodeDivider';
import PropTypes from 'prop-types';
import React from 'react';
import SvgText from 'components/SvgText';
import { sizePropTypes } from 'models';

const mapIndexed = addIndex(map);
const mapConnectionsCreator = cy => mapIndexed(({ networkName, ...props }, index) => (
  <NodeConnection
    key={networkName}
    name={networkName}
    cy={cy}
    index={index}
    {...props}
  />
));

const NodeConnections = ({
  connections,
  dividerY,
  textX,
  textY,
  size,
  circlesY,
  textHeight,
}) => {
  const mapConnections = mapConnectionsCreator(circlesY);

  return (
    <g>
      <NodeDivider y={dividerY} width={size.width} />
      <SvgText text="Uniões:" x={textX} y={textY} width={51} height={textHeight} />
      {mapConnections(connections)}
    </g>
  );
};

NodeConnections.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  connections: PropTypes.array.isRequired,
  dividerY: PropTypes.number.isRequired,
  textX: PropTypes.number.isRequired,
  textY: PropTypes.number.isRequired,
  size: sizePropTypes.isRequired,
  circlesY: PropTypes.number.isRequired,
  textHeight: PropTypes.number.isRequired,
};

export default (NodeConnections);
