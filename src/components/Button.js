import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  button: {
    cursor: 'pointer',
    fontSize: '18px',
    padding: '3px 10px',
    border: 'solid 1px #333',
    color: '#333',
    backgroundColor: '#fcfcfc',
    transition: 'background-color 0.1s',
    ':hover': {
      backgroundColor: '#f3f3f3',
    },
    ':focus': {
      outline: 0,
    },
  },
});

const Button = props => (
  <button
    className={css(styles.button, props.style)}
    onClick={props.onClick}
    title={props.title}
    type="button"
  >
    {props.children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  title: PropTypes.string,
};

export default Button;
