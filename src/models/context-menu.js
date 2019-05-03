import PropTypes, { shape } from 'prop-types';

export const contextMenuItem = shape({
  key: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
});
