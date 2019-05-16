import PropTypes, { shape } from 'prop-types';

export const positionPropTypes = shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
});

export const sizePropTypes = shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
});
