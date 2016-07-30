import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import Header from './Header';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';

const styles = StyleSheet.create({
  app: {
    fontFamily: 'Source Sans Pro',
    fontSize: '16px',
    height: '100vh',
  },
  container: {
    display: 'flex',
    height: 'calc(100vh - 50px)',
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
