import React from 'react';
import PropTypes from 'prop-types';
import fontAwesome from 'font-awesome/css/font-awesome.css';
import classNames from 'classnames';
import { concat } from 'ramda';

const Icon = ({ name }) =>
  <i className={classNames(fontAwesome.fa, fontAwesome[concat('fa-', name)])} />;

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;
