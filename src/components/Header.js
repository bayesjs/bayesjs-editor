import React from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    background: '#333',
  },
  title: {
    margin: 0,
    color: '#fcfcfc',
    padding: '5px 10px 10px',
  },
  menuButton: {
    fontSize: '24px',
    color: '#fcfcfc',
    marginLeft: 'auto',
    marginRight: '10px',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    ':focus': {
      outline: 0,
    },
  },
});

const Header = () => (
  <div className={css(styles.header)}>
    <h1 className={css(styles.title)}>Bayes Editor</h1>
    <button className={css(styles.menuButton)} type="button">
      <i className="fa fa-bars" />
    </button>
  </div>
);

export default Header;
