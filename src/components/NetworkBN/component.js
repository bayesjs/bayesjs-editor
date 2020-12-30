import React, { Component } from 'react';
import { inferenceResultsPropTypes, networkPropTypes, nodePropTypes } from '@models';

import AddNodeModal from '../AddNodeModal';
import EditNodeCptModal from '../EditNodeCptModal';
import EditNodeStatesModal from '../EditNodeStatesModal';
import Network from '../Network';
import PropTypes from 'prop-types';
import { getArrowsPositions } from '@utils/arrows-positions';
import { isDeleteKey } from '@utils/event';

class NetworkBN extends Component {
  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyup);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyup);
  }

  get nodes() {
    const { inferenceResults, network, nodes } = this.props;

    return nodes.map(node => ({
      ...node,
      name: node.id,
      results: inferenceResults[node.id],
      belief: network.beliefs[node.id],
    }));
  }

  get arrowContextItems() {
    const { onRemoveNodeConnection } = this.props;

    return [
      {
        key: 'remove-link',
        text: 'Remover ligação',
        style: { color: '#C62828' },
        onClick: (_, contextMenuArrow) => onRemoveNodeConnection(contextMenuArrow),
      },
    ];
  }

  get networkContextItems() {
    return [
      {
        key: 'add-node',
        text: 'Adicionar variável',
        onClick: ({ mousePosition }) => {
          this.net.createNode(mousePosition);
        },
      },
    ];
  }

  get nodeContextItems() {
    const { onRemoveNode, onEditNodeCpt, onEditNodeStates } = this.props;

    return [
      {
        key: 'add-child',
        text: 'Adicionar ligação',
        onClick: (_, contextMenuNode) => {
          this.net.startConnection(contextMenuNode);
        },
      },
      {
        key: 'edit-states',
        text: 'Editar estados',
        onClick: (_, contextMenuNode) => {
          onEditNodeStates(contextMenuNode);
        },
      },
      {
        key: 'edit-cpt',
        text: 'Editar probabilidades',
        onClick: (_, contextMenuNode) => {
          onEditNodeCpt(contextMenuNode);
        },
      },
      {
        key: 'remove-node',
        text: 'Remover variável',
        style: { color: '#C62828' },
        onClick: (_, contextMenuNode) => onRemoveNode(contextMenuNode),
      },
    ];
  }

  handleKeyup = (e) => {
    const { network, onRemoveNode } = this.props;

    if (isDeleteKey(e) && network.selectedNodes.length > 0 && document.activeElement.tagName === 'BODY') {
      network.selectedNodes.forEach((id) => {
        onRemoveNode({ id });
      });
    }
  }

  onSetBelief = (node, state) => {
    const { onResetNodeBelief, onSetNodeBelief, network } = this.props;

    if (network.beliefs[node.id] === state) {
      onResetNodeBelief(node);
    } else {
      onSetNodeBelief(node, state);
    }
  };

  requestCreateNode = (position, onRequestClose) => (
    <AddNodeModal
      position={position}
      onRequestClose={onRequestClose}
    />
  );

  render() {
    const {
      network,
      nodes,
      onConnectNodes,
      onChangeNodePosition,
      onChangeSelectedNodes,
    } = this.props;

    return (
      <div>
        <Network
          network={network}
          nodes={this.nodes}
          arrows={getArrowsPositions(nodes)}
          onStateDoubleClick={this.onSetBelief}
          onAddConnection={onConnectNodes}
          onSelectNodes={onChangeSelectedNodes}
          changeNodePosition={onChangeNodePosition}
          requestCreateNode={this.requestCreateNode}
          arrowContextItems={this.arrowContextItems}
          networkContextItems={this.networkContextItems}
          nodeContextItems={this.nodeContextItems}
          ref={(ref) => { this.net = ref; }}
        />

        <EditNodeStatesModal />
        <EditNodeCptModal />
      </div>
    );
  }
}

NetworkBN.propTypes = {
  network: networkPropTypes.isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes).isRequired,
  inferenceResults: inferenceResultsPropTypes.isRequired,
  onRemoveNodeConnection: PropTypes.func.isRequired,
  onChangeSelectedNodes: PropTypes.func.isRequired,
  onRemoveNode: PropTypes.func.isRequired,
  onConnectNodes: PropTypes.func.isRequired,
  onResetNodeBelief: PropTypes.func.isRequired,
  onSetNodeBelief: PropTypes.func.isRequired,
  onChangeNodePosition: PropTypes.func.isRequired,
  onEditNodeCpt: PropTypes.func.isRequired,
  onEditNodeStates: PropTypes.func.isRequired,
};

export default NetworkBN;
