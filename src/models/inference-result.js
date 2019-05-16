import PropTypes from 'prop-types';

export const inferenceResultsPropTypes = PropTypes.objectOf(
  PropTypes.objectOf(PropTypes.number),
);

export const inferenceResultsMSBNPropTypes = PropTypes.objectOf(
  PropTypes.objectOf(
    PropTypes.objectOf(PropTypes.number),
  ),
);
