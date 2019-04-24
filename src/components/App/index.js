import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  getNetworkKind,
} from 'selectors';
import Canvas from '../Canvas';
import Header from '../Header';
import PropertiesPanel from '../PropertiesPanel';
import styles from './styles.css';

class App extends Component {
  state = {
    key: 1,
  };

  getCanvas = () => this.canvas.getWrappedInstance();

  handleRequestRedraw = () => {
    setTimeout(() => {
      const { key } = this.state;

      this.getCanvas().calculateArrows();
      this.setState({ key: key + 1 });
    }, 0);
  };

  getPanel = () => {
    const { key } = this.state;

    return (
      <PropertiesPanel
        key={key}
        onEditNodeStates={node => this.getCanvas().onEditNodeStates(node)}
        onEditNodeCpt={node => this.getCanvas().onEditNodeCpt(node)}
        onStartConnection={subnetwork => this.getCanvas().onStartConnection(subnetwork)}
        onViewSubnetwork={subnetwork => this.getCanvas().onViewSubnetwork(subnetwork)}
        onViewLinkages={subnetwork => this.getCanvas().onViewLinkages(subnetwork)}
      />
    );
  }

  render() {
    return (
      <div className={styles.app}>
        <Header onRequestRedraw={this.handleRequestRedraw} />

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
