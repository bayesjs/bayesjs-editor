import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.css';

const Button = props => (
  <button
    type="button"
    className={classNames(styles.button, props.className, {
      [styles.primary]: props.primary,
    })}
    style={props.style}
    title={props.title}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  primary: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string,
};

export default Button;
