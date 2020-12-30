import React, { Component } from 'react';

import AddNodeModal from '@components/AddNodeModal';
import { NETWORK_KINDS } from '@constants/network';
import NetworkBN from '@components/NetworkBN';
import NetworkMSBN from '@components/NetworkMSBN';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getNetworkKind,
} from '@selectors';
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

  onStartConnection = (node) => {
    this.net.onStartConnection(node);
  };

  onViewSubnetwork = (node) => {
    this.net.onViewSubnetwork(node);
  };

  onViewLinkages = (node) => {
    this.net.onViewLinkages(node);
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
    const { networkKind } = this.props;

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
};

const mapStateToProps = state => ({
  networkKind: getNetworkKind(state),
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(Canvas);
