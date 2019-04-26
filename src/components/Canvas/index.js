import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  NETWORK_KINDS,
} from 'actions';
import {
  getNetworkKind,
} from 'selectors';
import AddNodeModal from '../AddNodeModal';
import NetworkBN from '../NetworkBN';
import NetworkMSBN from '../NetworkMSBN';
import styles from './styles.css';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newNodePosition: null,
    };

    this.rectRefs = {};
    this.movingNode = null;
    this.nodeToAddChildTo = null;
  }

  onEditNodeStates = (node) => {
    this.net.getWrappedInstance().onEditNodeStates(node);
  };

  onEditNodeCpt = (node) => {
    this.net.getWrappedInstance().onEditNodeCpt(node);
  };

  onStartConnection = (node) => {
    this.net.getWrappedInstance().onStartConnection(node);
  };

  onViewSubnetwork = (node) => {
    this.net.getWrappedInstance().onViewSubnetwork(node);
  };

  onViewLinkages = (node) => {
    this.net.getWrappedInstance().onViewLinkages(node);
  };

  renderDefs = () => (
    <defs>
      <marker
        id="triangle"
        viewBox="0 0 10 10"
        markerWidth="6"
        markerHeight="6"
        refX="8"
        refY="5"
        orient="auto"
      >
        <path d="M0,0 L10,5 L0,10" fill="#333" />
      </marker>
    </defs>
  );

  renderNetwork = () => {
    const { networkKind, onEditNodeCpt, onEditNodeStates } = this.props;

    if (networkKind === NETWORK_KINDS.MSBN) {
      return (
        <NetworkMSBN
          ref={(ref) => { this.net = ref; }}
        />
      );
    }

    return (
      <NetworkBN
        ref={(ref) => { this.net = ref; }}
        onEditNodeStates={onEditNodeStates}
        onEditNodeCpt={onEditNodeCpt}
      />
    );
  };

  render() {
    const { newNodePosition } = this.state;

    return (
      <div className={styles.scroll}>
        <div className={styles.container}>
          {this.renderNetwork()}

          <AddNodeModal
            position={newNodePosition}
            onRequestClose={() => this.setState({ newNodePosition: null })}
          />
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  networkKind: PropTypes.string.isRequired,
  onEditNodeStates: PropTypes.func.isRequired,
  onEditNodeCpt: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  networkKind: getNetworkKind(state),
});

export default connect(mapStateToProps, null, null, { withRef: true })(Canvas);
