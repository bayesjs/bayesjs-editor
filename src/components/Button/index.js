import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styles from './styles.css';

const Button = ({
  className, primary, title, onClick, children,
}) => (
  <button
    type="button"
    className={classNames(styles.button, className, {
      [styles.primary]: primary,
    })}
    title={title}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.defaultProps = {
  className: '',
  primary: false,
  title: '',
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  primary: PropTypes.bool,
  title: PropTypes.string,
};

export default Button;
