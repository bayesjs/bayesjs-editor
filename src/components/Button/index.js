import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { getComponentTestId } from 'utils/test-utils';
import styles from './styles.scss';

const Button = ({
  className,
  primary,
  name,
  title,
  disabled,
  ...props
}) => (
  <button
    type="button"
    className={classNames(styles.button, className, {
      [styles.buttonPrimary]: primary,
      [styles.buttonDisabled]: disabled,
    })}
    title={title}
    disabled={disabled}
    data-testid={getComponentTestId('Button', name || title)}
    {...props}
  />
);

Button.defaultProps = {
  className: '',
  primary: false,
  title: '',
  name: '',
  disabled: false,
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  primary: PropTypes.bool,
  title: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
