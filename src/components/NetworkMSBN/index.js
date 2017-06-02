import React, { PropTypes, Component } from "react";
import { connect } from 'react-redux';
import Network, { ContextMenuType } from "../Network";
import { openFile, saveFile } from '../../utils/file';
import SuperNode from '../SuperNode';
import AddNodeModal from '../AddNodeModal';
import Arrow from '../Arrow';
import SubNetwork from '../SubNetwork';
import Modal from '../Modal';
import LinkagesModal from '../LinkagesModal';
import { v4 } from 'uuid';
import { hasCycles, mergeNetworks } from './helpers';

import {
  getNetwork,
  getNodesWithPositions,
  getInferenceResults,
  getSubnetworks,
  getSubnetworksWithPosition,
  getLinkages,
  getLinkagesBySubnetwork,
  getLinkagesByTwoSubnetwork,
  getSubnetworksById,
  getInferenceResultsMSBN,
  getAllLinkagesBySubnetworkWithoutId,
  getSubnetworksColorById,
} from '../../selectors';

import { combNodesAndPositions } from '../../selectors/combiners';

import {
  addSuperNode,
  changeNetworkProperty,
  changeNodePosition,
  addLinkage,
  removeLinkage,
  removeSuperNode,
  setBelief,
  NETWORK_KINDS,
} from '../../actions';

class NetworkMSBN extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      connectSubnetwork: null,
      openSubnetwork: null,
      firstNodeToConnect: null,
      arrowsToExlude: null,
      editingLinkages: null,
    };

    this.onViewSubnetwork = this.onOpenSubnetwork.bind(this);
    this.onViewLinkages = this.onViewSubnetworkLinkages.bind(this);
    this.onRemoveNode = this.onRemoveNode.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this.connecting = false;

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
        key: 'view-super-node',
        text: 'Visualizar rede',
        onClick: this.onOpenSubnetwork.bind(this),
      },
      {
        key: 'open-super-node-linkages',
        text: 'Visualizar uniões',
        visible: ({ id }) => this.props.linkagesByNode[id].length > 0,
        onClick: this.onViewSubnetworkLinkages.bind(this),
      },
      {
        key: 'add-connection',
        text: 'Adicionar união',
        onClick: (contextMenuNode) => {
          this.onStartConnection(contextMenuNode);
        },
      },
      {
        key: 'remove-super-node',
        text: 'Remover rede',
        style: { color: '#C62828' },
        onClick: this.onRemoveNode,
      }
    ];

    this.arrowContextMenuItems = [
      {
        key: 'open-arrow-linkages',
        text: 'Visualizar uniões',
        // visible: ({ arrow }) => arrow.info.linkagesIds.length > 1,
        onClick: ({ arrow }) => {
          const links = arrow.info.linkagesIds;
          const dict = this.props.linkages;
          const linkages = links.reduce((p, id) => {
            p[id] = dict[id];
            return p;
          }, {});

          this.setState({ editingLinkages: linkages });
        },
      },
      {
        key: 'remove-linkage',
        text: 'Remover uniões',
        style: { color: '#C62828' },
        onClick: this.onRemoveArrow.bind(this),
      },
    ];
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyup);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyup);
  }

  onViewSubnetworkLinkages = ({ id }) => {
    const links = this.props.linkagesByNode[id];
    const linkages = links.reduce((p, { id, linkage }) => {
      p[id] = linkage;
      return p;
    }, {});

    this.setState({ editingLinkages: linkages });
  };

  onOpenSubnetwork = (openSubnetwork) => {
    this.setState({ openSubnetwork });
  };

  onRemoveNode = (node) => {
    const { dispatch } = this.props;
    const { id, linkageInfo } = node;
    const linkageIds = linkageInfo.map(x => x.id);
    
    for (const id of linkageIds) {
      dispatch(removeLinkage(id));
    }

    dispatch(removeSuperNode(id));
    
    setTimeout(this.calculateArrows.bind(this), 0);
  };

  onRemoveArrow = (arrow) => {
    const { dispatch } = this.props;
    const { arrow: { info: { linkagesIds } }  } = arrow;

    for (const id of linkagesIds) {
      dispatch(removeLinkage(id));
    }
    
    setTimeout(this.calculateArrows.bind(this), 0);
  };

  getArrowTitle = ({ info }) => {
    const size = info.linkages.length;
    const word = size == 1 ? 'união' : 'uniões';
    const reduceFunc = (p, [l1, l2], i) => {
      const message = `\n\n${l1.nodeId} - ${l2.nodeId}`;
      p += message;
      return p;
    };

    return (
      <title>
        {`${size} ${word} ${info.linkages.reduce(reduceFunc, '')}`}
      </title>
    );
  };

  renderArrow = (arrow, props) => {
    const title = this.getArrowTitle(arrow.arrow);
    
    return (
      <Arrow 
        key={arrow.key} 
        from={arrow.from}
        to={arrow.to}
        markEnd={false}
        title={title}
        {...props}
      />
    );
  };

  renderNode = (node, props) => {
    const id = node.id || node.name;
    const linkages = this.props.linkagesByNode[node.id];
    
    node.linkageInfo = linkages;

    return (
      <SuperNode
        key={id}
        id={node.name}
        selected={this.props.network.selectedNodes.some(x => x === node.id)}
        x={node.position.x}
        y={node.position.y}
        nodes={node.nodes}
        sumHeight={18}
        stroke={node.color}
        opacity={'0.3'}
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
    const { network, nodes } = this.props;
    
    if (key === 8 && network.selectedNodes.length > 0 && document.activeElement.tagName === "BODY") {
      network.selectedNodes.map((nodeId) => {
        const node = nodes.find(({ id }) => id == nodeId);
        
        this.onRemoveNode(node);
      }); 
    }
  }

  onStartConnection = (connectSubnetwork) => {
    this.connecting = true;
    this.setState({ connectSubnetwork });
  };

  onAddConnection = (idTo, idFrom) => {
    if (idFrom != idTo) {
      const { subnetworks } = this.props;

      this.setState({
        connectSubnetwork: subnetworks.find(s => s.id == idTo)
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
  
  checkCycles = (newLinkage) => {
    const { linkages, subnetworks } = this.props;
    const links = Object.keys(linkages).map(id => linkages[id]);
    const networks = subnetworks.map(({ id, name, nodes }) => {
      const dictNodes = nodes.reduce((p, node) => {
        p[node.id] = node;
        return p;
      }, {});

      return {
        id,
        name,
        nodes: dictNodes
      };
    });

    links.push(newLinkage);

    const { network } = mergeNetworks(networks, links);
    const nodes = Object.keys(network).map(id => network[id]);
  
    return hasCycles(nodes);
  }

  requestCreateNode = (position, onRequestClose) => {
    openFile('.json', json => {
      // try {
        let state = JSON.parse(json);
        
        if (!state.network.id) {
          state.network.id = v4();
        }

        if (state.network.kind == NETWORK_KINDS.MSBN) {
          alert('Não é possível adicionar uma MSBN!');
          return;
        } else if (this.existsSubnetwork(state.network)) {
          alert('Rede já adicionada!');
          return;
        } else if ((state.nodes != undefined && state.nodes.length == 0) || (state.network.nodes != undefined && state.network.nodes.length == 0)) {
          alert('Rede sem nodos!');
          return;
        }

        this.props.dispatch(addSuperNode(state, position));
        
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
    const { id, name, color } = subnetwork;
    return {
      ...node,
      network: {
        id,
        name,
        color,
      }
    };
  };

  validCpt = (node1, node2) => {
    // return node1.states.length === node2.states.length;

    if (node1.states.length != node2.states.length) return false;
    for (let i = 0; i < node1.states.length; i++) {
      if (node1.states[i] != node2.states[i]) return false;
    }

    return true;
  };

  checkParents = (node1, node2) => {
    if (node1.parents.length == 0 && node2.parents.length == 0) return true;
    const parents1 = node1.parents.sort();
    const parents2 = node2.parents.sort();

    // if (parents1.length > 0 && parents2.length > 0) return false;
    if (parents1.length == parents2.length) {
      for (let i = 0; i < parents1.length; i++) {
        if (parents1[i] != parents2[i]) return false;
      }

    } else if (parents1.length > parents2.length) {
      for (let parent of parents2) {
        if (parents1.indexOf(parent) === -1) return false;
      }

    } else if (parents1.length < parents2.length) {
      for (let parent of parents1) {
        if (parents2.indexOf(parent) === -1) return false;
      }
    }

    return true;
  };

  onClickSubnetworkNode = (subnetwork) => (node) => {
    if (this.connecting === false) return;
    const { firstNodeToConnect } = this.state;

    if (firstNodeToConnect) {
      const n = this.creatNodeWithParent(subnetwork, node);
      const linkage = this.createLinkage(firstNodeToConnect, n);
      const cycles = this.checkCycles(linkage);
      
      if (!this.checkParents(firstNodeToConnect, n)) {
        alert('Não é possível unir dois nodos que possuem coneções.');
        
      } else if (!this.validCpt(firstNodeToConnect, n)) {
        alert('Número de estados entre os nodos é diferente. Ambos devem contar com os mesmos estados.');

      } else if (cycles) {
        alert('Essa união irá resultar em uma rede ciclica, ou seja, uma rede circular. Sua ação não será completada.');
        
      } else {
        this.props.dispatch(addLinkage(linkage));
        setTimeout(this.calculateArrows.bind(this), 0);
      }

      this.cancelConnection();
    }
  };

  onDoubleClickSubnetworkNode = (subnetwork) => (node) => {
    if (this.connecting === false) return;
    const { firstNodeToConnect } = this.state;

    //Selected first node, that will be connected with another one
    if (firstNodeToConnect === null) {
      // if (confirm(`Deseja ligar ${node.id}?`)) {
        this.setState({ 
          connectSubnetwork: null,
          firstNodeToConnect: this.creatNodeWithParent(subnetwork, node)
        });

        this.net.startConnection(subnetwork);
      // }
    }
  };

  onSelectSubNodeConnection = (subnetwork) => (node) => {
    const { firstNodeToConnect } = this.state;
    
    //Selected first node, that will be connected with another one
    if (firstNodeToConnect === null) {
      // if (confirm(`Deseja ligar ${node.id}?`)) {
        this.setState({ 
          connectSubnetwork: null,
          firstNodeToConnect: this.creatNodeWithParent(subnetwork, node)
        });

        this.net.startConnection(subnetwork);
      // }
    } else {
      const n = this.creatNodeWithParent(subnetwork, node);
      const linkage = this.createLinkage(firstNodeToConnect, n);
      const cycles = this.checkCycles(linkage);

      if (cycles) {
        alert('Essa união irá resultar em uma rede ciclica, ou seja, uma rede circular. Sua ação não será completada.');
        
      } else {
        this.props.dispatch(addLinkage(linkage));
        setTimeout(this.calculateArrows.bind(this), 0);
      }

      this.cancelConnection();
    }
  };

  createLinkage = (node1, node2) => {
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
    this.connecting = false;
    this.setState({
      connectSubnetwork: null,
      firstNodeToConnect: null,
    });
  };

  onDoubleClickNode = (openSubnetwork) => {
    this.setState({ openSubnetwork })
  };

  getLinkedNodesFromSubnetwork = (subnetwork) => {
    const { nodes, id } = subnetwork;
    const links = this.props.linkagesByNode[id];
    const names = this.props.subnetworksById;
    const colors = this.props.subnetworksColorById;
    let result = [];
      
    const linkedNodes = nodes.forEach((n) => {
      let connections = [];

      links.forEach(({ linkage: [ l1, l2 ] } ) => {
        if (l1.networkId == id && l1.nodeId == n.id) {
          connections.push({
            nodeId: l2.nodeId,
            networkId: l2.networkId, 
            color: colors[l2.networkId],
            networkName: names[l2.networkId],
          });
        } else if (l2.networkId == id && l2.nodeId == n.id) {
          connections.push({
            nodeId: l1.nodeId,
            networkId: l1.networkId, 
            color: colors[l1.networkId], 
            networkName: names[l1.networkId],
          });
        }
      });

      if (connections.length) {
        result.push({
          nodeId: n.id,
          connections
        });
      }
    });

    return result;
  };

  renderSubNetwork = (subnetwork, onRequestClose, onClickNode, onDoubleClickNode = null, connecting = false, connectingNode = null) => {
    const { nodes, positions, beliefs, name, id, color } = subnetwork;
    const nodesAndPositions = combNodesAndPositions(nodes, positions);
    const linkedNodes = this.getLinkedNodesFromSubnetwork(subnetwork);
    const { inferenceResultsMSBN } = this.props;
    const subBeliefs = inferenceResultsMSBN[id];
    
    return (
      <Modal
        title={`Subrede ${name}`}
        onRequestClose={onRequestClose}
        isOpen={subnetwork !== null}>
        
        <SubNetwork 
          network={subnetwork}
          nodes={nodesAndPositions}
          linkedNodes={linkedNodes}
          inferenceResults={subBeliefs}
          onClickNode={onClickNode}
          onDoubleClickNode={onDoubleClickNode}
          connecting={connecting}
          connectingNode={connectingNode}
          onSetBelief={this.onSetBelief}
          networkColor={color}
        />

      </Modal>
    );
  };

  renderSubNetworks = () => {
    const { openSubnetwork, connectSubnetwork, firstNodeToConnect } = this.state;

    if (connectSubnetwork) {
      if (firstNodeToConnect) {
        const { network } = firstNodeToConnect;
        
        if (network.id == connectSubnetwork.id) {
          this.cancelConnection();

          return null;
        }
      }

      return this.renderSubNetwork(
        connectSubnetwork, 
        this.cancelConnection, 
        this.onClickSubnetworkNode(connectSubnetwork),
        this.onDoubleClickSubnetworkNode(connectSubnetwork),
        true,
        firstNodeToConnect
      );
    } else if (openSubnetwork) {
      return this.renderSubNetwork(
        openSubnetwork, 
        () => { this.setState({ openSubnetwork: null }); }, 
        () => {}
      );
    }

    return null;
  };

  getArrows = () => {
    const { linkages, nodes, linkagesByTwoNode } = this.props;
    const groups = linkagesByTwoNode;
    const get = ((networkId) => {
      return nodes.find(n => n.id == networkId);
    });

    return groups.map((info) => {
      return {
        from: get(info.networkId1),
        to: get(info.networkId2),
        info,
      };
    });

    const temp = linkages.map(([a, b]) => {
      return {
        from: get(a),
        to: get(b),
      };
    });
    
    return temp;
  };

  getLinkagesModal = () => {
    const { editingLinkages } = this.state;
    
    if (editingLinkages) {
      return (
        <LinkagesModal 
          linkages={this.state.editingLinkages}
          subnetworksById={this.props.subnetworksById}
          onRequestClose={(deleteLinkPlease) => {
            for (const id of deleteLinkPlease) {
              this.props.dispatch(removeLinkage(id));
            }
            
            this.setState({ editingLinkages: null });
            setTimeout(this.calculateArrows.bind(this), 0);
          }}
        />
      );
    }

    return null;
  };

  onSetBelief = (subnetwork, node, state) => {
    const { dispatch, network, allLinkagesBySubnetworkWithoutId } = this.props;
    const { beliefs } = network;

    const changeBelief = (networkId: string, nodeId: string) => {
      if (beliefs[networkId] && beliefs[networkId][nodeId] === state) {
        dispatch(setBelief(nodeId, null, networkId));
      } else {
        dispatch(setBelief(nodeId, state, networkId));
      }
    };

    const connectedNodes = allLinkagesBySubnetworkWithoutId[subnetwork.id].map((linkage) => {
      let [l1, l2] = linkage;
      
      if (l1.networkId == subnetwork.id && l1.nodeId == node.id) {
        return l2;
      } else if (l2.networkId == subnetwork.id && l2.nodeId == node.id) {
        return l1;
      }
      return null;
    }).filter(value => value);

    changeBelief(subnetwork.id, node.id);

    for (let info of connectedNodes) {
      changeBelief(info.networkId, info.nodeId);
    }
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

          {this.renderSubNetworks()}
          {this.getLinkagesModal()}
      </div>
    );
  }
}

NetworkMSBN.propTypes = {
  dispatch: PropTypes.func.isRequired,
  network: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  subnetworks: PropTypes.array.isRequired,
  linkages: PropTypes.object.isRequired,
  inferenceResults: PropTypes.object.isRequired,
  linkagesByNode: PropTypes.object.isRequired,
  linkagesByTwoNode: PropTypes.array.isRequired,
  subnetworksById: PropTypes.object.isRequired,
  subnetworksColorById: PropTypes.object.isRequired,
  allLinkagesBySubnetworkWithoutId: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  network: getNetwork(state),
  nodes: getSubnetworksWithPosition(state),
  inferenceResults: getInferenceResults(state),
  subnetworks: getSubnetworks(state),
  linkages: getLinkages(state),
  linkagesByNode: getLinkagesBySubnetwork(state),
  linkagesByTwoNode: getLinkagesByTwoSubnetwork(state),
  subnetworksById: getSubnetworksById(state),
  subnetworksColorById: getSubnetworksColorById(state),
  inferenceResultsMSBN: getInferenceResultsMSBN(state),
  allLinkagesBySubnetworkWithoutId: getAllLinkagesBySubnetworkWithoutId(state),
});

export default connect(mapStateToProps, null, null, { withRef: true })(NetworkMSBN);