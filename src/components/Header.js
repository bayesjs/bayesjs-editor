import React from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: 'solid 1px #333',
  },
  title: {
    margin: 0,
    padding: '5px 10px',
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
