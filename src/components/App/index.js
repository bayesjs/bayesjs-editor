import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../Header';
import Canvas from '../Canvas';
import PropertiesPanel from '../PropertiesPanel';
import EditStatesModal from '../EditStatesModal';
import EditCptModal from '../EditCptModal';
import styles from './styles.css';
import { ActionCreators } from 'redux-undo';

import {
  getNetworkKind,
} from '../../selectors';

import {
  NETWORK_KINDS,
  undo,
  redo,
} from '../../actions';

class App extends Component {
  state = {
    key: 1
  };

  getCanvas = () => {
    return this.canvas.getWrappedInstance();
  };

  componentDidMount() {
    window.addEventListener('keyup', this.keyupHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.keyupHandler);
  }

  keyupHandler = (e) => {
    const key = e.keyCode || e.which;
    
    if (e.ctrlKey) {
      if (key === 90) {
        console.log('UNDO');
        // this.props.dispatch(ActionCreators.undo());
      } else if (key === 89) {
        console.log('REDO');
        // this.props.dispatch(ActionCreators.redo());
      }
    }
  };

  handleRequestRedraw = () => {
    setTimeout(() => {
      this.getCanvas().calculateArrows();
      this.setState({ key: this.state.key + 1 });
    }, 0);
  };

  getPanel = () => {
    return (
      <PropertiesPanel
        key={this.state.key}
        onEditNodeStates={node => this.getCanvas().onEditNodeStates(node)}
        onEditNodeCpt={node => this.getCanvas().onEditNodeCpt(node)}
        onStartConnection={subnetwork => this.getCanvas().onStartConnection(subnetwork)}
        onViewSubnetwork={subnetwork => this.getCanvas().onViewSubnetwork(subnetwork)}
        onViewLinkages={subnetwork => this.getCanvas().onViewLinkages(subnetwork)}
      />
    );
  };

  render() {
    return (
      <div className={styles.app}>
        <Header onRequestRedraw={this.handleRequestRedraw} />

        <div className={styles.container}>
          <Canvas
            ref={ref => (this.canvas = ref)}
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
