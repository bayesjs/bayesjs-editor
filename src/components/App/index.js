import React from 'react';
import Header from '../Header';
import Canvas from '../Canvas';
import PropertiesPanel from '../PropertiesPanel';
import styles from './styles.css';

const App = () => (
  <div className={styles.app}>
    <Header />
    <div className={styles.container}>
      <Canvas />
      <PropertiesPanel />
    </div>
  </div>
);

export default App;
