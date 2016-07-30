import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import Header from './Header';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';

const styles = StyleSheet.create({
  app: {
    fontFamily: 'Source Sans Pro',
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  container: {
    flex: 1,
    display: 'flex',
  },
});

const App = () => (
  <div className={css(styles.app)}>
    <Header />
    <div className={css(styles.container)}>
      <Canvas />
      <PropertiesPanel />
    </div>
  </div>
);

export default App;
