import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { getComponentTestId } from '../../utils/test-utils';
import styles from './styles.css';

const Button = ({
  className, primary, title, onClick, name, children,
}) => (
  <button
    type="button"
    className={classNames(styles.button, className, {
      [styles.primary]: primary,
    })}
    title={title}
    onClick={onClick}
    data-testid={getComponentTestId('Button', name || title)}
  >
    {children}
  </button>
);

Button.defaultProps = {
  className: '',
  primary: false,
  title: '',
  name: '',
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  primary: PropTypes.bool,
  title: PropTypes.string,
  name: PropTypes.string,
};

export default Button;
