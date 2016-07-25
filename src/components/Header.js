import React from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(to bottom, #555, #111)',
  },
  title: {
    margin: 0,
    color: '#fcfcfc',
    padding: '5px 10px 10px',
  },
  menuButton: {
    height: 30,
    marginLeft: 'auto',
    marginRight: '10px',
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
