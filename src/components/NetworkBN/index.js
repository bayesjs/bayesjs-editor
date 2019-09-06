import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  addParent,
  changeNetworkProperty,
  changeNodePosition,
  removeNode,
  removeParent,
  setBelief,
} from 'actions';
import {
  getInferenceResults,
  getNetwork,
  getNodesWithPositionsAndSizes,
} from 'selectors';
import { nodePropTypes, networkPropTypes, inferenceResultsPropTypes } from 'models';
import { getArrowsPositions } from 'utils/arrows-positions';
import Network from '../Network';

import AddNodeModal from '../AddNodeModal';
import EditCptModal from '../EditCptModal';
import EditStatesModal from '../EditStatesModal';

class NetworkBN extends Component {
  state = {
    editingNodeStates: null,
    editingNodeCpt: null,
  };

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
    const { dispatch } = this.props;

    return [
      {
        key: 'remove-link',
        text: 'Remover ligação',
        style: { color: '#C62828' },
        onClick: (_, contextMenuArrow) => {
          const { childId, parentId } = contextMenuArrow;
          dispatch(removeParent(childId, parentId));
        },
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
    const { dispatch } = this.props;

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
          this.onEditNodeStates(contextMenuNode);
        },
      },
      {
        key: 'edit-cpt',
        text: 'Editar probabilidades',
        onClick: (_, contextMenuNode) => {
          this.onEditNodeCpt(contextMenuNode);
        },
      },
      {
        key: 'remove-node',
        text: 'Remover variável',
        style: { color: '#C62828' },
        onClick: (_, contextMenuNode) => {
          dispatch(removeNode(contextMenuNode.id));
        },
      },
    ];
  }

  onEditNodeStates = (editingNodeStates) => {
    this.setState({ editingNodeStates });
  };

  onEditNodeCpt = (editingNodeCpt) => {
    this.setState({ editingNodeCpt });
  };

  onSelectNodes = (nodes) => {
    const { dispatch } = this.props;

    dispatch(changeNetworkProperty('selectedNodes', nodes));
  };

  handleKeyup = (e) => {
    const key = e.keyCode || e.which;
    const { network, dispatch } = this.props;

    if ([8, 46].indexOf(key) !== -1 && network.selectedNodes.length > 0 && document.activeElement.tagName === 'BODY') {
      network.selectedNodes.forEach((nodeId) => {
        dispatch(removeNode(nodeId));
      });
    }
  }

  onAddConnection = (idFrom, idTo) => {
    const { dispatch } = this.props;

    dispatch(addParent(idFrom, idTo));
  };

  onCancelConnection = () => {

  };

  onSetBelief = (node, state) => {
    const { dispatch, network } = this.props;

    if (network.beliefs[node.id] === state) {
      dispatch(setBelief(node.id, null));
    } else {
      dispatch(setBelief(node.id, state));
    }
  };

  requestCreateNode = (position, onRequestClose) => (
    <AddNodeModal
      position={position}
      onRequestClose={onRequestClose}
    />
  );

  changeNodePosition = (id, newX, newY) => {
    const { dispatch } = this.props;

    dispatch(changeNodePosition(id, newX, newY));
  };

  render() {
    const { network, nodes } = this.props;
    const { editingNodeStates, editingNodeCpt } = this.state;

    return (
      <div>
        <Network
          network={network}
          nodes={this.nodes}
          arrows={getArrowsPositions(nodes)}
          onStateDoubleClick={this.onSetBelief}
          onAddConnection={this.onAddConnection}
          onCancelConnection={this.onCancelConnection}
          onSelectNodes={this.onSelectNodes}
          changeNodePosition={this.changeNodePosition}
          requestCreateNode={this.requestCreateNode}
          arrowContextItems={this.arrowContextItems}
          networkContextItems={this.networkContextItems}
          nodeContextItems={this.nodeContextItems}
          ref={(ref) => { this.net = ref; }}
        />

        <EditStatesModal
          node={editingNodeStates}
          onRequestClose={() => {
            this.setState({ editingNodeStates: null });
          }}
        />

        <EditCptModal
          node={editingNodeCpt}
          onRequestClose={() => this.setState({ editingNodeCpt: null })}
        />
      </div>
    );
  }
}

NetworkBN.propTypes = {
  dispatch: PropTypes.func.isRequired,
  network: networkPropTypes.isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes).isRequired,
  inferenceResults: inferenceResultsPropTypes.isRequired,
};

const mapStateToProps = (s, ownProps) => {
  let state = s;
  if (ownProps.network) {
    state = ownProps;
  }

  return {
    network: getNetwork(state),
    nodes: getNodesWithPositionsAndSizes(state),
    inferenceResults: getInferenceResults(state),
  };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(NetworkBN);
