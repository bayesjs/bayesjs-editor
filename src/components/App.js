import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import Header from './Header';

const styles = StyleSheet.create({
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  canvas: {
    flex: 1,
  },
});

const App = () => (
  <div className={css(styles.app)}>
    <Header />
    <div className={css(styles.canvas)}></div>
  </div>
);

export default App;
