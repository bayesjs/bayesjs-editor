import PropTypes, { shape } from 'prop-types';

const arrowFromTo = shape({
  type: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
});

export const arrowPropTypes = shape({
  key: PropTypes.string.isRequired,
  from: arrowFromTo.isRequired,
  to: arrowFromTo.isRequired,
  markEnd: PropTypes.bool.isRequired,
  childId: PropTypes.string,
  parentId: PropTypes.string,
});
