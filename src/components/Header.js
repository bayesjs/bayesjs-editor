import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import Button from './Button';

const styles = StyleSheet.create({
  header: {
    height: 50,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  title: {
    margin: 0,
    color: '#fcfcfc',
    paddingLeft: 10,
  },
  menuButton: {
    padding: 0,
    marginLeft: 'auto',
    marginRight: 10,
    fontSize: '1.6em',
    color: '#fcfcfc',
    border: 'none',
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: 'transparent',
    },
  },
});

const Header = () => (
  <div className={css(styles.header)}>
    <h1 className={css(styles.title)}>Bayes Editor</h1>
    <Button
      onClick={() => alert('menu')}
      style={styles.menuButton}
      title="Menu"
    >
      <i className="fa fa-bars" />
    </Button>
  </div>
);

export default Header;
