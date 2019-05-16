import PropTypes, { shape } from 'prop-types';

const cptWithoutParents = PropTypes.objectOf(PropTypes.number).isRequired;

const cptWithParentsItem = shape({
  when: PropTypes.objectOf(PropTypes.string).isRequired,
  then: PropTypes.objectOf(PropTypes.number).isRequired,
});

const cptWithParents = PropTypes.arrayOf(cptWithParentsItem);

export const statePropTypes = PropTypes.string.isRequired;

export const nodePropTypes = shape({
  id: PropTypes.string.isRequired,
  states: PropTypes.arrayOf(statePropTypes).isRequired,
  parents: PropTypes.arrayOf(PropTypes.string).isRequired,
  cpt: PropTypes.oneOfType([cptWithoutParents, cptWithParents]),
});
