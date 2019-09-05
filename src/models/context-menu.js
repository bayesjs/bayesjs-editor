import PropTypes, { shape } from 'prop-types';

export const contextMenuItemPropTypes = shape({
  key: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
});
