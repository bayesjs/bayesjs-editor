import React, { PropTypes, Component } from "react";
import { connect } from 'react-redux';
import Network, { ContextMenuType } from "../Network";
import { openFile, saveFile } from '../../utils/file';
import SuperNode from '../SuperNode';
import AddNodeModal from '../AddNodeModal';
import Arrow from '../Arrow';
import SubNetwork from '../SubNetwork';
import Modal from '../Modal';
import { v4 } from 'uuid';

import {
  getNetwork,
  getNodesWithPositions,
  getInferenceResults,
  getSubnetworks,
  getSubnetworksWithPosition,
  getLinkages,
} from '../../selectors';

import { combNodesAndBeliefs, combNodesAndPositions } from '../../selectors/combiners';

import {
  addSuperNode,
  changeNetworkProperty,
  changeNodePosition,
  addLinkage,
  removeLinkage,
  removeSuperNode,
} from '../../actions';

class NetworkMSBN extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connectNetwork: null,
      firstNodeToConnect: null,
    };

    this.onDoubleClickNode = this.onStartConnection;

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
      },
      {
        key: 'remove-super-node',
        text: 'Remover rede',
        onClick: (contextNode) => {
          const { dispatch } = this.props;
          const { id } = contextNode;
          const linkageIndexes = this.getLinkagesIndexes(id);

          dispatch(removeSuperNode(id));

          for (let index of linkageIndexes) {
            dispatch(removeLinkage(index));
          }
          
          setTimeout(this.calculateArrows.bind(this), 0);
        }
      }
    ];

    this.arrowContextMenuItems = [
      {
        key: 'remove-linkage',
        text: 'Remover ligação',
        onClick: (contextMenuArrow) => {
          const { dispatch } = this.props;
          const { index } = contextMenuArrow;

          dispatch(removeLinkage(index));
          setTimeout(this.calculateArrows.bind(this), 0);
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

  getLinkagesIndexes = (netId) => {
    const { linkages } = this.props;
    
    return linkages.reduce((p, [l1, l2], index) => {
      if (l1.networkId == netId || l2.networkId == netId) {
        p.push(index);
      }
      return p;
    }, []);
  };

  getArrowTitle = (arrow) => {
    
  };

  renderArrow = (arrow, props) => {
    const title = this.getArrowTitle(arrow.arrow);

    return (
      <Arrow 
        key={arrow.key} 
        from={arrow.from}
        to={arrow.to}
        markEnd={false}
        {...props}
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

  onAddConnection = (idTo, idFrom) => {
    if (idFrom != idTo) {
      const { subnetworks } = this.props;

      this.setState({
        connectNetwork: subnetworks.find(s => s.id == idTo)
      });
    }
  };

  onCancelConnection = () => {
    this.cancelConnection();
  };

  existsSubnetwork = (subnetwork) => {
    const { subnetworks } = this.props;
    const { id, name } = subnetwork;
    
    return subnetworks.some((net) => net.id == id || net.name == name);
  };

  requestCreateNode = (position, onRequestClose) => {
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
    setTimeout(this.calculateArrows.bind(this), 0);
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

  creatNodeWithParent = (subnetwork, node) => {
    const { id, name } = subnetwork;
    return {
      ...node,
      network: {
        id,
        name
      }
    };
  }

  onSelectSubNodeConnection = (subnetwork) => (node) => {
    const { firstNodeToConnect } = this.state;
    
    //Selected first node, that will be connected with another one
    if (firstNodeToConnect === null) {
      // if (confirm(`Deseja ligar ${node.id}?`)) {
        this.setState({ 
          connectNetwork: null,
          firstNodeToConnect: this.creatNodeWithParent(subnetwork, node)
        });

        this.net.startConnection(subnetwork);
      // }
    } else {
      const n = this.creatNodeWithParent(subnetwork, node);
      const linkage = this.createLinakege(firstNodeToConnect, n);

      this.setState({ 
        connectNetwork: null,
        firstNodeToConnect: null,
      });

      this.props.dispatch(addLinkage(linkage));
      setTimeout(this.calculateArrows.bind(this), 0);
    }
  };

  createLinakege = (node1, node2) => {
    const create = ({ id, network }) => ({
      networkId: network.id,
      nodeId: id,
    });

    return [
      create(node1),
      create(node2),
    ];
  };

  cancelConnection = () => {
    this.setState({
      connectNetwork: null
    });
  };

  renderSubNetwork = () => {
    const subnetwork = this.state.connectNetwork;

    if (subnetwork) {
      const { nodes, positions, beliefs } = subnetwork;
      const inferenceResults = combNodesAndBeliefs(nodes, beliefs);
      const nodesAndPositions = combNodesAndPositions(nodes, positions);
      
      if (this.state.firstNodeToConnect) {
        const { network } = this.state.firstNodeToConnect;
        
        if (network.id == subnetwork.id) {
          this.cancelConnection();

          return null;
        }
      }

      return (
        <Modal
          title={`Subrede ${subnetwork.name}`}
          onRequestClose={this.cancelConnection}
          isOpen={subnetwork !== null}>
          
          <SubNetwork 
            network={subnetwork}
            nodes={nodesAndPositions}
            state={subnetwork}
            inferenceResults={inferenceResults}
            onDoubleClickNode={this.onSelectSubNodeConnection(subnetwork)}
          />

        </Modal>
      );
    }

    return null;
  };

  getArrows = () => {
    //preciso agrupar
    const { linkages, nodes } = this.props;
    const get = (({ networkId, nodeId }) => {
      return nodes.find(n => n.id == networkId);
    });

    return linkages.map(([a, b]) => {
      return {
        from: get(a),
        to: get(b),
      };
    });
  };

  render() {
    return (
      <div>
        <Network
          network={this.props.network}
          nodes={this.props.nodes}
          arrows={this.getArrows}
          renderNode={this.renderNode}
          renderArrow={this.renderArrow}
          onAddConnection={this.onAddConnection}
          onCancelConnection={this.onCancelConnection}
          onSelectNodes={this.onSelectNodes}
          changeNodePosition={this.changeNodePosition}
          getContextItems={this.getContextItems}
          requestCreateNode={this.requestCreateNode}
          onDoubleClickNode={this.onDoubleClickNode}
          ref={ref => (this.net = ref)}
          />

          {this.renderSubNetwork()}
      </div>
    );
  }
}

NetworkMSBN.propTypes = {
  dispatch: PropTypes.func.isRequired,
  network: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  subnetworks: PropTypes.array.isRequired,
  linkages: PropTypes.array.isRequired,
  inferenceResults: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  network: getNetwork(state),
  nodes: getSubnetworksWithPosition(state),
  inferenceResults: getInferenceResults(state),
  subnetworks: getSubnetworks(state),
  linkages: getLinkages(state),
});

export default connect(mapStateToProps, null, null, { withRef: true })(NetworkMSBN);