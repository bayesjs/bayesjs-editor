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
import Network, { ContextMenuType } from '../Network';

import AddNodeModal from '../AddNodeModal';
import Arrow from '../Arrow';
import EditCptModal from '../EditCptModal';
import EditStatesModal from '../EditStatesModal';
import Node from '../Node';

class NetworkBN extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;

    this.state = {
      key: 1,
      editingNodeStates: null,
      editingNodeCpt: null,
    };

    this.canvasContextMenuItems = [
      {
        key: 'add-node',
        text: 'Adicionar variável',
        onClick: (contextMenuPosition) => {
          this.net.createNode(contextMenuPosition);
        },
      },
    ];

    this.nodeContextMenuItems = [
      {
        key: 'add-child',
        text: 'Adicionar ligação',
        onClick: (contextMenuNode) => {
          this.net.startConnection(contextMenuNode);
        },
      },
      {
        key: 'edit-states',
        text: 'Editar estados',
        onClick: (contextMenuNode) => {
          this.onEditNodeStates(contextMenuNode);
        },
      },
      {
        key: 'edit-cpt',
        text: 'Editar probabilidades',
        onClick: (contextMenuNode) => {
          this.onEditNodeCpt(contextMenuNode);
        },
      },
      {
        key: 'remove-node',
        text: 'Remover variável',
        style: { color: '#C62828' },
        onClick: (contextMenuNode) => {
          dispatch(removeNode(contextMenuNode.id));
        },
      },
    ];

    this.arrowContextMenuItems = [
      {
        key: 'remove-link',
        text: 'Remover ligação',
        style: { color: '#C62828' },
        onClick: (contextMenuArrow) => {
          const { childId, parentId } = contextMenuArrow;
          dispatch(removeParent(childId, parentId));
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

  onEditNodeStates = (editingNodeStates) => {
    this.setState({ editingNodeStates });
  };

  onEditNodeCpt = (editingNodeCpt) => {
    this.setState({ editingNodeCpt });
  };

  renderArrow = (arrow, props) => (
    <Arrow
      key={arrow.key}
      from={arrow.from}
      to={arrow.to}
      markEnd
      {...props}
    />
  );

  renderNode = (node, props) => {
    const { inferenceResults, network } = this.props;

    return (
      <Node
        key={node.id}
        results={inferenceResults[node.id]}
        selected={network.selectedNodes.some(x => x === node.id)}
        belief={network.beliefs[node.id]}
        onStateDoubleClick={state => this.onSetBelief(node, state)}
        {...node}
        {...props}
      />
    );
  }

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
    setTimeout(this.net.renderArrows, 0);
  };

  handleRequestRedraw = () => {
    setTimeout(() => {
      const { key } = this.state;

      this.setState({ key: key + 1 });
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

  getArrows = () => {
    const { nodes } = this.props;
    const arrows = [];

    nodes.forEach((node) => {
      node.parents.forEach((parentId) => {
        const parent = nodes.find(x => x.id === parentId);

        arrows.push({
          from: parent,
          to: node,
        });
      });
    });

    return arrows;
  };

  render() {
    const { network, nodes } = this.props;
    const { editingNodeStates, editingNodeCpt } = this.state;

    return (
      <div>
        <Network
          network={network}
          nodes={nodes}
          arrows={getArrowsPositions(nodes)}
          renderNode={this.renderNode}
          renderArrow={this.renderArrow}
          onAddConnection={this.onAddConnection}
          onCancelConnection={this.onCancelConnection}
          onSelectNodes={this.onSelectNodes}
          changeNodePosition={this.changeNodePosition}
          getContextItems={this.getContextItems}
          requestCreateNode={this.requestCreateNode}
          ref={(ref) => { this.net = ref; }}
        />

        <EditStatesModal
          node={editingNodeStates}
          onRequestClose={() => {
            this.setState({ editingNodeStates: null });
            this.handleRequestRedraw();
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

export default connect(mapStateToProps, null, null, { withRef: true })(NetworkBN);
