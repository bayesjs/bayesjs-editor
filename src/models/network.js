import PropTypes, { shape } from 'prop-types';

import { linkagesPropTypes } from '@models/linkage';
import { nodePropTypes } from '@models/node';
import { positionPropTypes } from '@models/position';

const beliefsPropTypes = PropTypes.objectOf(PropTypes.string);
const beliefsMSBNPropTypes = PropTypes.objectOf(beliefsPropTypes);

export const subNetworkInferenceResultsPropTypes = PropTypes.objectOf(
  PropTypes.objectOf(PropTypes.number),
);

export const networkConnection = shape({
  color: PropTypes.string.isRequired,
  networkId: PropTypes.string.isRequired,
  networkName: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
});

export const linkedNodePropTypes = shape({
  connections: PropTypes.arrayOf(networkConnection).isRequired,
  nodeId: PropTypes.string.isRequired,
});

const networkShape = {
  height: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  linkages: linkagesPropTypes.isRequired,
  beliefs: PropTypes.oneOfType([beliefsPropTypes, beliefsMSBNPropTypes]).isRequired,
  name: PropTypes.string.isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes),
  positions: PropTypes.objectOf(positionPropTypes),
  propertiesPanelVisible: PropTypes.bool.isRequired,
  selectedNodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.number.isRequired,
};

export const networkPropTypes = shape({
  ...networkShape,
  subnetworks: PropTypes.arrayOf(shape(networkShape)),
});

export const subnetworkPropTypes = PropTypes.shape({
  ...networkShape,
  color: PropTypes.string.isRequired,
});
