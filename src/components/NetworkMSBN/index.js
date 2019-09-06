import {
  addLinkage,
  addSuperNode,
  changeNetworkProperty,
  changeNodePosition,
  removeLinkage,
  removeSuperNode,
  setBelief,
} from 'actions';
import { NETWORK_KINDS } from 'constants/network';
import Network from 'components/Network';
import React, { Component } from 'react';
import { combNodesWithPositions, combNodesWithSizes } from 'selectors/combiners';
import {
  getAllLinkagesBySubnetworkWithoutId,
  getInferenceResultsMSBN,
  getLinkages,
  getLinkagesBySubnetwork,
  getLinkagesByTwoSubnetwork,
  getNetwork,
  getSubnetworksById,
  getSubnetworksColorById,
  getSubnetworksWithPositionAndSizes,
} from 'selectors';
import {
  linkagesPropTypes,
  networkPropTypes,
  subnetworkPropTypes,
  linkagesByNodePropTypes,
  linkagesByTwoNodePropTypes,
  allLinkagesBySubnetworkWithoutIdPropTypes,
  inferenceResultsMSBNPropTypes,
} from 'models';

import LinkagesModal from 'components/LinkagesModal';
import PropTypes from 'prop-types';
import SubNetwork from 'components/SubNetwork';
import { connect } from 'react-redux';
import { getArrowsPositionsForMSBN } from 'utils/arrows-positions';
import { openFile } from 'utils/file';
import { v4 } from 'uuid';
import { isDeleteKey } from 'utils/event';
import { hasCycles, mergeNetworks } from './helpers';

class NetworkMSBN extends Component {
  state = {
    connectSubnetwork: null,
    openSubnetwork: null,
    firstNodeToConnect: null,
    editingLinkages: null,
    addingChildArrow: null,
  };

  connecting = false;

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyup);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyup);
  }

  get nodes() {
    const { linkagesByNode, network, subNetworks } = this.props;

    return subNetworks.map((subNetwork) => {
      const id = subNetwork.id || subNetwork.name;
      const linkages = linkagesByNode[subNetwork.id];

      return {
        ...subNetwork,
        id,
        linkageInfo: linkages,
        selected: network.selectedNodes.some(x => x === subNetwork.id),
        stroke: subNetwork.color,
        opacity: '0.3',
      };
    });
  }

  get arrowContextItems() {
    return [
      {
        key: 'open-arrow-linkages',
        text: 'Visualizar uniões',
        onClick: (_, { linkagesIds }) => {
          const { linkages } = this.props;
          const dict = linkages;
          const newLinkages = linkagesIds.reduce((p, id) => {
            p[id] = dict[id];
            return p;
          }, {});

          this.setState({ editingLinkages: newLinkages });
        },
      },
      {
        key: 'remove-linkage',
        text: 'Remover uniões',
        style: { color: '#C62828' },
        onClick: this.onRemoveArrow,
      },
    ];
  }

  get networkContextItems() {
    return [
      {
        key: 'add-super-node',
        text: 'Adicionar rede',
        onClick: ({ mousePosition }) => {
          this.net.createNode(mousePosition);
        },
      },
    ];
  }

  get nodeContextItems() {
    return [
      {
        key: 'view-super-node',
        text: 'Visualizar rede',
        onClick: this.onOpenSubnetwork,
      },
      {
        key: 'open-super-node-linkages',
        text: 'Visualizar uniões',
        disabled: ({ id }) => {
          const { linkagesByNode } = this.props;
          const node = linkagesByNode[id];

          return node && node.length === 0;
        },
        onClick: this.onViewSubnetworkLinkages,
      },
      {
        key: 'add-connection',
        text: 'Adicionar união',
        onClick: (_, contextMenuNode) => {
          this.onStartConnection(contextMenuNode);
        },
      },
      {
        key: 'remove-super-node',
        text: 'Remover rede',
        style: { color: '#C62828' },
        onClick: this.onRemoveNode,
      },
    ];
  }


  onViewSubnetworkLinkages = (_, { id }) => {
    const { linkagesByNode } = this.props;
    const links = linkagesByNode[id];
    const linkages = links.reduce((p, item) => {
      const { linkage } = item;
      p[item.id] = linkage;
      return p;
    }, {});

    this.setState({ editingLinkages: linkages });
  };

  onOpenSubnetwork = (_, openSubnetwork) => {
    this.setState({ openSubnetwork });
  };

  onRemoveNode = (_, node) => {
    const { dispatch } = this.props;
    const { id, linkageInfo } = node;
    const linkageIds = linkageInfo.map(x => x.id);

    linkageIds.forEach(linkageId => dispatch(removeLinkage(linkageId)));

    dispatch(removeSuperNode(id));
  };

  onRemoveArrow = (_, { linkagesIds }) => {
    const { dispatch } = this.props;

    linkagesIds.forEach(linkageId => dispatch(removeLinkage(linkageId)));
  };

  getArrowTitle = ({ info }) => {
    const size = info.linkages.length;
    const word = size === 1 ? 'união' : 'uniões';
    const reduceFunc = (p, [l1, l2]) => {
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

  onSelectNodes = (nodes) => {
    const { dispatch } = this.props;

    dispatch(changeNetworkProperty('selectedNodes', nodes));
  };

  handleKeyup = (e) => {
    const { network, subNetworks } = this.props;

    if (isDeleteKey(e) && network.selectedNodes.length > 0 && document.activeElement.tagName === 'BODY') {
      network.selectedNodes.forEach((nodeId) => {
        const node = subNetworks.find(({ id }) => id === nodeId);

        this.onRemoveNode(node);
      });
    }
  }

  onStartConnection = (connectSubnetwork) => {
    this.connecting = true;
    this.setState({ connectSubnetwork });
  };

  onAddConnection = (idTo, idFrom) => {
    if (idFrom !== idTo) {
      const { subNetworks } = this.props;

      this.setState({
        connectSubnetwork: subNetworks.find(s => s.id === idTo),
      });
    }
  };

  existsSubnetwork = (subnetwork) => {
    const { subNetworks } = this.props;
    const { id, name } = subnetwork;

    return subNetworks.some(net => net.id === id || net.name === name);
  };

  checkCycles = (newLinkage) => {
    const { linkages, subNetworks } = this.props;
    const links = Object.keys(linkages).map(id => linkages[id]);
    const networks = subNetworks.map(({ id, name, nodes }) => {
      const dictNodes = nodes.reduce((p, node) => {
        p[node.id] = node;
        return p;
      }, {});

      return {
        id,
        name,
        nodes: dictNodes,
      };
    });

    links.push(newLinkage);

    const { network } = mergeNetworks(networks, links);
    const nodes = Object.keys(network).map(id => network[id]);

    return hasCycles(nodes);
  }

  requestCreateNode = (position) => {
    openFile('.json', (json) => {
      const { dispatch } = this.props;
      const state = JSON.parse(json);

      if (!state.network.id) {
        state.network.id = v4();
      }

      if (state.network.kind === NETWORK_KINDS.MSBN) {
        window.alert('Não é possível adicionar uma MSBN!');
      } if (this.existsSubnetwork(state.network)) {
        window.alert('Rede já adicionada!');
      } if (
        (state.nodes !== undefined && state.nodes.length === 0)
        || (state.network.nodes !== undefined && state.network.nodes.length === 0)
      ) {
        window.alert('Rede sem nodos!');
      } else {
        dispatch(addSuperNode(state, position));
      }
    });
  };

  changeNodePosition = (id, newX, newY) => {
    const { dispatch } = this.props;

    dispatch(changeNodePosition(id, newX, newY));
  };

  creatNodeWithParent = (subnetwork, node) => {
    const { id, name, color } = subnetwork;
    return {
      ...node,
      network: {
        id,
        name,
        color,
      },
    };
  };

  validCpt = (node1, node2) => {
    // return node1.states.length === node2.states.length;

    if (node1.states.length !== node2.states.length) return false;
    for (let i = 0; i < node1.states.length; i++) {
      if (node1.states[i] !== node2.states[i]) return false;
    }

    return true;
  };

  checkParents = (node1, node2) => {
    if (node1.parents.length === 0 && node2.parents.length === 0) return true;
    const parents1 = node1.parents.sort();
    const parents2 = node2.parents.sort();

    // if (parents1.length > 0 && parents2.length > 0) return false;
    if (parents1.length === parents2.length) {
      for (let i = 0; i < parents1.length; i++) {
        if (parents1[i] !== parents2[i]) return false;
      }
    } else if (parents1.length > parents2.length) {
      for (const parent of parents2) { // eslint-disable-line
        if (parents1.indexOf(parent) === -1) return false;
      }
    } else if (parents1.length < parents2.length) {
      for (const parent of parents1) { // eslint-disable-line
        if (parents2.indexOf(parent) === -1) return false;
      }
    }

    return true;
  };

  onClickSubnetworkNode = subnetwork => (node) => {
    const { dispatch } = this.props;
    if (this.connecting === false) return;
    const { firstNodeToConnect } = this.state;

    if (firstNodeToConnect) {
      const n = this.creatNodeWithParent(subnetwork, node);
      const linkage = this.createLinkage(firstNodeToConnect, n);
      const cycles = this.checkCycles(linkage);

      if (!this.checkParents(firstNodeToConnect, n)) {
        window.alert('Não é possível unir dois nodos que possuem coneções.');
      } else if (!this.validCpt(firstNodeToConnect, n)) {
        window.alert('Número de estados entre os nodos é diferente. Ambos devem contar com os mesmos estados.');
      } else if (cycles) {
        window.alert('Essa união irá resultar em uma rede ciclica, ou seja, uma rede circular. Sua ação não será completada.');
      } else {
        dispatch(addLinkage(linkage));
      }

      this.cancelConnection();
    }
  };

  onDoubleClickSubnetworkNode = subnetwork => (node) => {
    if (this.connecting === false) return;
    const { firstNodeToConnect } = this.state;

    // Selected first node, that will be connected with another one
    if (firstNodeToConnect === null) {
      this.setState({
        connectSubnetwork: null,
        firstNodeToConnect: this.creatNodeWithParent(subnetwork, node),
      });

      this.net.startConnection(subnetwork);
    }
  };

  onSelectSubNodeConnection = subnetwork => (node) => {
    const { dispatch } = this.props;
    const { firstNodeToConnect } = this.state;

    // Selected first node, that will be connected with another one
    if (firstNodeToConnect === null) {
      this.setState({
        connectSubnetwork: null,
        firstNodeToConnect: this.creatNodeWithParent(subnetwork, node),
      });

      this.net.startConnection(subnetwork);
    } else {
      const n = this.creatNodeWithParent(subnetwork, node);
      const linkage = this.createLinkage(firstNodeToConnect, n);
      const cycles = this.checkCycles(linkage);

      if (cycles) {
        window.alert('Essa união irá resultar em uma rede ciclica, ou seja, uma rede circular. Sua ação não será completada.');
      } else {
        dispatch(addLinkage(linkage));
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
    this.setState({ openSubnetwork });
  };

  getLinkedNodesFromSubnetwork = (subnetwork) => {
    const { linkagesByNode, subnetworksById, subnetworksColorById } = this.props;
    const { nodes, id } = subnetwork;
    const links = linkagesByNode[id];
    const names = subnetworksById;
    const colors = subnetworksColorById;
    const result = [];

    nodes.forEach((n) => {
      const connections = [];

      links.forEach(({ linkage: [l1, l2] }) => {
        if (l1.networkId === id && l1.nodeId === n.id) {
          connections.push({
            nodeId: l2.nodeId,
            networkId: l2.networkId,
            color: colors[l2.networkId],
            networkName: names[l2.networkId],
          });
        } else if (l2.networkId === id && l2.nodeId === n.id) {
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
          connections,
        });
      }
    });

    return result;
  };

  renderSubNetwork = (
    subnetwork,
    onRequestClose,
    onClickNode,
    onDoubleClickNode = null,
    connecting = false,
    connectingNode = null,
  ) => {
    const {
      nodes,
      positions,
      id,
      color,
    } = subnetwork;
    const nodesAndPositions = combNodesWithSizes(combNodesWithPositions(nodes, positions));
    const linkedNodes = this.getLinkedNodesFromSubnetwork(subnetwork);
    const { inferenceResultsMSBN } = this.props;
    const subBeliefs = inferenceResultsMSBN[id];

    return (
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
        onRequestClose={onRequestClose}
      />
    );
  };

  renderSubNetworks = () => {
    const { openSubnetwork, connectSubnetwork, firstNodeToConnect } = this.state;

    if (connectSubnetwork) {
      if (firstNodeToConnect) {
        const { network } = firstNodeToConnect;

        if (network.id === connectSubnetwork.id) {
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
        firstNodeToConnect,
      );
    } if (openSubnetwork) {
      return this.renderSubNetwork(
        openSubnetwork,
        () => { this.setState({ openSubnetwork: null }); },
        () => { },
      );
    }

    return null;
  };

  getLinkagesModal = () => {
    const { subnetworksById, dispatch } = this.props;
    const { editingLinkages } = this.state;

    if (editingLinkages) {
      return (
        <LinkagesModal
          linkages={editingLinkages}
          subnetworksById={subnetworksById}
          onRequestClose={(deleteLinkPlease) => {
            deleteLinkPlease.forEach(id => dispatch(removeLinkage(id)));

            this.setState({ editingLinkages: null });
          }}
        />
      );
    }

    return null;
  };

  onSetBelief = (subnetwork, node, state) => {
    const { dispatch, network, allLinkagesBySubnetworkWithoutId } = this.props;
    const { beliefs } = network;

    const changeBelief = (networkId, nodeId) => {
      if (beliefs[networkId] && beliefs[networkId][nodeId] === state) {
        dispatch(setBelief(nodeId, null, networkId));
      } else {
        dispatch(setBelief(nodeId, state, networkId));
      }
    };

    const connectedNodes = allLinkagesBySubnetworkWithoutId[subnetwork.id].map((linkage) => {
      const [l1, l2] = linkage;

      if (l1.networkId === subnetwork.id && l1.nodeId === node.id) {
        return l2;
      } if (l2.networkId === subnetwork.id && l2.nodeId === node.id) {
        return l1;
      }
      return null;
    }).filter(value => value);

    changeBelief(subnetwork.id, node.id);

    connectedNodes.forEach(({ networkId, nodeId }) => changeBelief(networkId, nodeId));
  };

  render() {
    const { network, subNetworks, linkagesByTwoNode } = this.props;
    const { addingChildArrow } = this.state;

    return (
      <div>
        <Network
          network={network}
          nodes={this.nodes}
          arrows={getArrowsPositionsForMSBN(subNetworks, linkagesByTwoNode)}
          renderNode={this.renderNode}
          onAddConnection={this.onAddConnection}
          onSelectNodes={this.onSelectNodes}
          changeNodePosition={this.changeNodePosition}
          requestCreateNode={this.requestCreateNode}
          onDoubleClickNode={this.onDoubleClickNode}
          ref={(ref) => { this.net = ref; }}
          addingChildArrow={addingChildArrow}
          arrowContextItems={this.arrowContextItems}
          networkContextItems={this.networkContextItems}
          nodeContextItems={this.nodeContextItems}
        />

        {this.renderSubNetworks()}
        {this.getLinkagesModal()}
      </div>
    );
  }
}

NetworkMSBN.propTypes = {
  dispatch: PropTypes.func.isRequired,
  network: networkPropTypes.isRequired,
  subNetworks: PropTypes.arrayOf(subnetworkPropTypes).isRequired,
  linkages: linkagesPropTypes.isRequired,
  linkagesByNode: linkagesByNodePropTypes.isRequired,
  linkagesByTwoNode: linkagesByTwoNodePropTypes.isRequired,
  subnetworksById: PropTypes.objectOf(PropTypes.string).isRequired,
  subnetworksColorById: PropTypes.objectOf(PropTypes.string).isRequired,
  allLinkagesBySubnetworkWithoutId: allLinkagesBySubnetworkWithoutIdPropTypes.isRequired,
  inferenceResultsMSBN: inferenceResultsMSBNPropTypes.isRequired,
};

const mapStateToProps = state => ({
  network: getNetwork(state),
  subNetworks: getSubnetworksWithPositionAndSizes(state),
  linkages: getLinkages(state),
  linkagesByNode: getLinkagesBySubnetwork(state),
  linkagesByTwoNode: getLinkagesByTwoSubnetwork(state),
  subnetworksById: getSubnetworksById(state),
  subnetworksColorById: getSubnetworksColorById(state),
  inferenceResultsMSBN: getInferenceResultsMSBN(state),
  allLinkagesBySubnetworkWithoutId: getAllLinkagesBySubnetworkWithoutId(state),
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(NetworkMSBN);
