import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AddNodeModal from '../AddNodeModal';
import Node from '../Node';
import styles from './styles.css';
import { openFile } from '../../utils/file';
import NetworkBN from "../NetworkBN";
import NetworkMSBN from "../NetworkMSBN";

import {
  removeNode,
  addParent,
  removeParent,
  changeNetworkProperty,
  changeNodePosition,
  setBelief,
  addSuperNode,
  NETWORK_KINDS
} from '../../actions';

import {
  getNetworkKind,
} from '../../selectors';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arrows: [],
      contextMenuItems: [],
      newNodePosition: null,
      addingChildArrow: null,
      movingNodePlaceholder: null
    };

    this.rectRefs = {};
    this.movingNode = null;
    this.nodeToAddChildTo = null;

  }

  componentDidMount() {
    // this.calculateArrows();
  }

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

  calculateArrows = () => {
    this.net.getWrappedInstance().calculateArrows();
  };

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

  renderNetwork = () => {
    if (this.props.networkKind === NETWORK_KINDS.MSBN) {
      return (
        <NetworkMSBN 
          ref={ref => (this.net = ref)}
          />
      );
    }

    return (
      <NetworkBN 
        ref={ref => (this.net = ref)}
        onEditNodeStates={this.props.onEditNodeStates}
        onEditNodeCpt={this.props.onEditNodeCpt}
        />
    );
  };

  render() {
    let addingChildArrow = null;
    let movingNodePlaceholder = null;

    if (this.state.addingChildArrow !== null) {
      const { from, to } = this.state.addingChildArrow;

      addingChildArrow = (
        <path
          d={`M${from.x},${from.y} ${to.x},${to.y}`}
          fill="none"
          stroke="#333"
          strokeWidth="2"
          strokeDasharray="5,5"
          markerEnd="url(#triangle)"
        />
      );
    }

    if (this.state.movingNodePlaceholder !== null) {
      const { x, y, height, width } = this.state.movingNodePlaceholder;

      movingNodePlaceholder = (
        <rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill="none"
          stroke="#333"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      );
    }

    return (
      <div className={styles.scroll}>
        <div className={styles.container}>
          {this.renderNetwork()}

          <AddNodeModal
            position={this.state.newNodePosition}
            onRequestClose={() => this.setState({ newNodePosition: null })}
          />
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  dispatch: PropTypes.func.isRequired,
  networkKind: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  networkKind: getNetworkKind(state),
});

export default connect(mapStateToProps, null, null, { withRef: true })(Canvas);
