import PropTypes from 'prop-types';

const cptWithoutParents = PropTypes.objectOf(PropTypes.number).isRequired;

const cptWithParentsItem = {
  when: PropTypes.objectOf(PropTypes.string).isRequired,
  then: PropTypes.objectOf(PropTypes.number).isRequired,
};

const cptWithParents = PropTypes.arrayOf(cptWithParentsItem);

const beliefsPropTypes = PropTypes.objectOf(PropTypes.string).isRequired;

const linkagePropTypes = {
  networkId: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
};
export const linkagesPropTypes = PropTypes.objectOf(linkagePropTypes);

export const statesPropTypes = PropTypes.arrayOf(PropTypes.string).isRequired;

export const nodePropTypes = {
  id: PropTypes.string.isRequired,
  states: statesPropTypes,
  parents: PropTypes.arrayOf(PropTypes.string).isRequired,
  cpt: PropTypes.oneOfType([cptWithoutParents, cptWithParents]),
};

export const positionPropTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.string.isRequired,
};

const positionsPropTypes = PropTypes.objectOf(positionPropTypes);

export const networkPropTypes = {
  beliefs: beliefsPropTypes,
  height: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  linkages: linkagesPropTypes.isRequired,
  name: PropTypes.string.isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes),
  positions: positionsPropTypes,
  propertiesPanelVisible: PropTypes.bool.isRequired,
  selectedNodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  subnetworks: PropTypes.arrayOf(subnetworkPropTypes), // eslint-disable-line
  width: PropTypes.number.isRequired,
};

export const subnetworkPropTypes = PropTypes.shape({
  ...networkPropTypes,
  color: PropTypes.string.isRequired,
});

export const inferenceResultsPropTypes = PropTypes.object;
