import PropTypes, { shape } from 'prop-types';

import { networkPropTypes } from 'models/network';
import { nodePropTypes } from 'models/node';
import { positionPropTypes } from 'models/position';

export const stateToSavePropTypes = shape({
  version: PropTypes.number.isRequired,
  network: networkPropTypes.isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes).isRequired,
  positions: PropTypes.objectOf(positionPropTypes).isRequired,
});
