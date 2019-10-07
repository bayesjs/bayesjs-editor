import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { getComponentTestId } from 'utils/test-utils';
import { bem } from 'utils/styles';
import styles from './styles.scss';

const componentClassName = bem(styles);

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
    className={classNames(className, componentClassName.modifiers({
      primary,
      disabled,
    }).toString())}
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
