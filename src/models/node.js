import PropTypes, { shape } from 'prop-types';

export const cptWithoutParentsPropTypes = PropTypes.objectOf(PropTypes.number).isRequired;

const cptWithParentsPropTypesItem = shape({
  when: PropTypes.objectOf(PropTypes.string).isRequired,
  then: PropTypes.objectOf(PropTypes.number).isRequired,
});

export const cptWithParentsPropTypes = PropTypes.arrayOf(cptWithParentsPropTypesItem);

export const statePropTypes = PropTypes.string.isRequired;

export const nodePropTypes = shape({
  id: PropTypes.string.isRequired,
  states: PropTypes.arrayOf(statePropTypes).isRequired,
  parents: PropTypes.arrayOf(PropTypes.string).isRequired,
  cpt: PropTypes.oneOfType([cptWithoutParentsPropTypes, cptWithParentsPropTypes]),
});
