import PropTypes, { shape } from 'prop-types';

const linkagePropTypes = PropTypes.arrayOf(
  shape({
    networkId: PropTypes.string.isRequired,
    nodeId: PropTypes.string.isRequired,
  }),
);

export const linkagesPropTypes = PropTypes.objectOf(linkagePropTypes);

export const linkagesByNodePropTypes = PropTypes.objectOf(
  PropTypes.arrayOf(
    shape({
      id: PropTypes.string.isRequired,
      linkage: linkagePropTypes.isRequired,
    }),
  ),
);

export const linkagesByTwoNodePropTypes = PropTypes.arrayOf(
  shape({
    linkages: PropTypes.arrayOf(linkagePropTypes).isRequired,
    linkagesIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    networkId1: PropTypes.string.isRequired,
    networkId2: PropTypes.string.isRequired,
  }),
);

export const allLinkagesBySubnetworkWithoutIdPropTypes = PropTypes.objectOf(
  PropTypes.arrayOf(
    linkagePropTypes,
  ),
);
