import React, { PropTypes, Component } from "react";
import { connect } from 'react-redux';
import Network, { ContextMenuType } from "../Network";
import { openFile, saveFile } from '../../utils/file';
import SuperNode from '../SuperNode';
import AddNodeModal from '../AddNodeModal';
import Arrow from '../Arrow';
import NetworkBN from '../NetworkBN';
import ModalNetwork from '../ModalNetwork';
import { v4 } from 'uuid';

import {
  getNetwork,
  getNodesWithPositions,
  getInferenceResults,
  getSubnetworks,
  getSubnetworksWithPosition,
} from '../../selectors';

import {
  addSuperNode,
  changeNetworkProperty,
  changeNodePosition,
} from '../../actions';

class NetworkMSBN extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connectNetwork: null,
    };

    this.canvasContextMenuItems = [
      {
        key: 'add-super-node',
        text: 'Adicionar rede',
        onClick: (contextMenuPosition) => {
          this.net.createNode(contextMenuPosition);
        },
      }
    ];
    
    this.nodeContextMenuItems = [
      {
        key: 'add-connection',
        text: 'Adicionar ligação',
        onClick: (contextMenuNode) => {
          this.onStartConnection(contextMenuNode);
        },
      }
    ];

    this.arrowContextMenuItems = [
      {
        key: 'remove-link',
        text: 'Remover ligação',
        onClick: (contextMenuArrow) => {
          // const { childId, parentId } = contextMenuArrow;
          // this.props.dispatch(removeParent(childId, parentId));
          // setTimeout(() => this.calculateArrows(), 0);
        },
      },
    ];
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyup);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyup);
  }

  renderArrow = (arrow, handleArrowMouseDown) => {
    const onMouseDown = e => handleArrowMouseDown(arrow, e);
    
    return (
      <Arrow 
        key={arrow.key} 
        onMouseDown={onMouseDown}
        from={arrow.from}
        to={arrow.to}
        markEnd={true}
      />
    );
  };

  renderNode = (node, props) => {
    const id = node.id || node.name;

    return (
      <SuperNode
        key={id}
        id={node.name}
        selected={this.props.network.selectedNodes.some(x => x === node.id)}
        x={node.position.x}
        y={node.position.y}
        nodes={node.nodes}
        sumHeight={18}
        {...props}
      />
    );
  };

  changeNetworkProperty = (name, value) => {
    // this.props.dispatch(changeNetworkProperty(name, value));
  };

  onSelectNodes = (nodes) => {
    this.props.dispatch(
      changeNetworkProperty('selectedNodes', nodes)
    );
  };

  handleKeyup = (e) => {
    const key = e.keyCode || e.which;
    const { network } = this.props;

    if (key === 8 && network.selectedNodes.length > 0) {
      network.selectedNodes.map((nodeId) => {
        this.props.dispatch(removeNode(nodeId));
      });
      setTimeout(() => this.calculateArrows(), 0);
    }
  }

  onStartConnection = (connectNetwork) => {
    this.setState({ connectNetwork });
  };

  onAddConnection = (idFrom, idTo) => {
    
  };

  onCancelConnection = () => {
    
  };

  onSetBelief = (node, state) => {
    if (this.props.network.beliefs[node.id] === state) {
      this.props.dispatch(setBelief(node.id, null));
    } else {
      this.props.dispatch(setBelief(node.id, state));
    }
  };

  existsSubnetwork = (subnetwork) => {
    const { subnetworks } = this.props;
    const { id, name } = subnetwork;
    
    return subnetworks.some((net) => net.id == id || net.name == name);
  };

  onCreateNode = (position, onRequestClose) => {
    openFile('.json', json => {
      // try {
        let state = JSON.parse(json);
        
        if (state.network.id === undefined) {
          state.network.id = v4();
        }

        if (this.existsSubnetwork(state.network)) {
          alert('Rede já adicionada!');
          return;
        }

        this.props.dispatch(addSuperNode(state, position));
        // this.props.onRequestRedraw();
      // } catch (ex) {
      //   console.log(ex);
      //   alert('Arquivo inválido');
      // }
    });
  };

  changeNodePosition = (id, newX, newY) => {
    this.props.dispatch(changeNodePosition(id, newX, newY));
    setTimeout(this.net.renderArrows, 0);
  };

  calculateArrows = () => {
    this.net.renderArrows();
  };

  handleRequestRedraw = () => {
    setTimeout(() => {
      this.calculateArrows();
      this.setState({ key: this.state.key + 1 });
    }, 0);
  };

  getContextItems = (type) => {
    switch (type) {
      case ContextMenuType.ARROW:
        return this.arrowContextMenuItems;
      case ContextMenuType.NODE:
        return this.nodeContextMenuItems;
      case ContextMenuType.CANVAS:
        return this.canvasContextMenuItems;
      default:
        return [];
    }
  };

  rendetNetwork = () => {
    if (this.state.connectNetwork) {
      const { nodes } = this.state.connectNetwork;

      return (
        <ModalNetwork>
          <NetworkBN 
            network={this.state.connectNetwork}
            nodes={nodes}
            state={this.state.connectNetwork}
          />
        </ModalNetwork>
      );
    }

    return (
      <Network
        network={this.props.network}
        nodes={this.props.nodes}
        renderNode={this.renderNode}
        renderArrow={this.renderArrow}
        changeNetworkProperty={this.changeNetworkProperty}
        onAddConnection={this.onAddConnection}
        onCancelConnection={this.onCancelConnection}
        onSelectNodes={this.onSelectNodes}
        changeNodePosition={this.changeNodePosition}
        getContextItems={this.getContextItems}
        onCreateNode={this.onCreateNode}
        onSetBelief={this.onSetBelief}
        ref={ref => (this.net = ref)}
        />
    );
  };

  render() {
    return (
      <div>{this.rendetNetwork()}</div>
    );
  }
}

NetworkMSBN.propTypes = {
  dispatch: PropTypes.func.isRequired,
  network: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  subnetworks: PropTypes.array.isRequired,
  inferenceResults: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  network: getNetwork(state),
  nodes: getSubnetworksWithPosition(state),
  inferenceResults: getInferenceResults(state),
  subnetworks: getSubnetworks(state),
});

export default connect(mapStateToProps, null, null, { withRef: true })(NetworkMSBN);