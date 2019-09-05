import { ContextMenuTrigger as Trigger } from 'react-contextmenu';
import React from 'react';
import { concat } from 'ramda';
import PropTypes from 'prop-types';

const ContextMenuTrigger = ({ id, type, ...props }) =>
  <Trigger id={concat(id, type)} {...props} />;

ContextMenuTrigger.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default ContextMenuTrigger;
