import React, { Component } from 'react';
import Header from '../Header';
import Canvas from '../Canvas';
import PropertiesPanel from '../PropertiesPanel';
import styles from './styles.css';

class App extends Component {
  state = {
    key: 1,
  };

  handleRequestRedraw = () => {
    setTimeout(() => {
      this.canvas.getWrappedInstance().calculateArrows();
      this.setState({ key: this.state.key + 1 });
    }, 0);
  };

  render() {
    return (
      <div className={styles.app}>
        <Header onRequestRedraw={this.handleRequestRedraw} />
        <div className={styles.container}>
          <Canvas ref={ref => (this.canvas = ref)} />
          <PropertiesPanel key={this.state.key} onRequestRedraw={this.handleRequestRedraw} />
        </div>
      </div>
    );
  }
}

export default App;
