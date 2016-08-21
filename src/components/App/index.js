import React, { Component } from 'react';
import Header from '../Header';
import Canvas from '../Canvas';
import PropertiesPanel from '../PropertiesPanel';
import styles from './styles.css';

class App extends Component {
  handleRequestRedraw = () => {
    setTimeout(() => {
      this.canvas.getWrappedInstance().calculateArrows();
    }, 0);
  };

  render() {
    return (
      <div className={styles.app}>
        <Header />
        <div className={styles.container}>
          <Canvas ref={ref => (this.canvas = ref)} />
          <PropertiesPanel onRequestRedraw={this.handleRequestRedraw} />
        </div>
      </div>
    );
  }
}

export default App;
