import React, { Component } from 'react';

import Canvas from '../Canvas';
import Header from '../Header';
import PropertiesPanel from '../PropertiesPanel';
import { connect } from 'react-redux';
import {
  getNetworkKind,
} from '@selectors';
import styles from './styles.css';

class App extends Component {
  getCanvas = () => this.canvas;

  getPanel = () => (
    <PropertiesPanel
      onStartConnection={subnetwork => this.getCanvas().onStartConnection(subnetwork)}
      onViewSubnetwork={subnetwork => this.getCanvas().onViewSubnetwork(subnetwork)}
      onViewLinkages={subnetwork => this.getCanvas().onViewLinkages(subnetwork)}
    />
  );

  render() {
    return (
      <div className={styles.app}>
        <Header />

        <div className={styles.container}>
          <Canvas
            ref={(ref) => { this.canvas = ref; }}
          />

          {this.getPanel()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  networkKind: getNetworkKind(state),
});

export default connect(mapStateToProps)(App);
