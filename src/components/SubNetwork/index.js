import Network, { ContextMenuType } from 'components/Network';
import React, { Component } from 'react';
import {
  linkedNodePropTypes,
  networkPropTypes,
  nodePropTypes,
  subNetworkInferenceResultsPropTypes,
} from 'models';

import ArrowPlaceholder from 'components/ArrowPlaceholder';
import PropTypes from 'prop-types';
import { getArrowsPositions } from 'utils/arrows-positions';
import { getNodeSize } from 'utils/node-size';
import { noop } from 'lodash';
import { propEq } from 'ramda';

class SubNetwork extends Component {
  constructor(props) {
    super(props);
    const { connecting, onDoubleClickNode } = props;

    this.state = {
      addingChildArrow: null,
    };

    this.nodeContextMenuItems = [
      {
        key: 'connect-node',
        text: 'Unir',
        visible: connecting,
        onClick: (contextMenuNode) => {
          onDoubleClickNode(contextMenuNode);
        },
      },
      {
        key: 'linkages-node',
        text: 'Ver Uniões',
        visible: ({ link }) => link,
        onClick: () => {
          window.alert('Nao implementado');
        },
      },
    ];
  }

  get nodes() {
    const {
      nodes,
      network,
      inferenceResults,
      networkColor,
    } = this.props;

    const finalNodes = nodes.map((node) => {
      const key = `${network.name}-${node.id}`;
      const linkedNode = this.getLinkedFromNode(node);
      const size = getNodeSize({ ...node, linkedNode });

      return {
        ...node,
        name: node.id,
        key,
        results: inferenceResults[node.id],
        belief: network.beliefs[node.id],
        stroke: networkColor,
        canMove: false,
        opacity: '0.3',
        linkedNode,
        size,
      };
    });

    return [
      ...finalNodes,
      ...(this.connectionNodes ? [this.connectionNodes] : []),
    ];
  }

  get connectionNodes() {
    const {
      connectingNode, network,
    } = this.props;

    if (connectingNode) {
      const { network: { name, color } } = connectingNode;
      const key = `${network.name}-${connectingNode.id}`;
      const node = {
        ...connectingNode,
        name: connectingNode.id,
        states: [],
        key: `${key}-view`,
        position: { x: 5, y: 5 },
        id: name,
        stroke: color,
        canMove: true,
        opacity: '0.3',
        description: connectingNode.id,
        showDescription: true,
      };

      return {
        ...node,
        size: getNodeSize({ ...node }),
      };
    }

    return null;
  }

  get addingChildArrowFrom() {
    const { connectingNode } = this.props;

    if (connectingNode) {
      const { size } = this.nodes.find(propEq('id', connectingNode.id));

      return {
        x: 5 + (size.width / 2),
        y: 5 + (size.height / 2),
      };
    }

    return null;
  }

  getLinkedFromNode = ({ id }) => {
    const { linkedNodes } = this.props;

    return linkedNodes.find(({ nodeId }) => nodeId === id);
  };

  getLinkTitle = ({ connections }) => connections.reduce((p, c) => {
    const message = `${c.networkName} - ${c.nodeId}`;
    p += message;
    return p;
  }, '');

  onSetBelief = (node, state) => {
    const { connecting, onSetBelief, network } = this.props;

    if (!connecting && onSetBelief) {
      onSetBelief(network, node, state);
    }
  }

  getContextItems = (type) => {
    switch (type) {
      case ContextMenuType.NODE:
        return this.nodeContextMenuItems;
      default:
        return [];
    }
  }

  renderAddingChildArrow = () => {
    const { addingChildArrow } = this.state;

    return addingChildArrow && <ArrowPlaceholder {...addingChildArrow} />;
  }

  render() {
    const { network, onClickNode, onDoubleClickNode } = this.props;
    const modalWidth = window.innerWidth * 0.8;
    const modalHeight = window.innerHeight * 0.8;
    const bigger = (a, b) => (a > b ? a : b);
    const newNetwork = {
      ...network,
      height: bigger(modalHeight, network.height + 30) - 20,
      width: bigger(modalWidth, network.width + 30) - 20,
    };

    return (
      <div style={{
        width: modalWidth,
        height: modalHeight,
      }}
      >
        <Network
          network={newNetwork}
          nodes={this.nodes}
          arrows={getArrowsPositions(this.nodes)}
          onStateDoubleClick={this.onSetBelief}
          addingChildArrowFrom={this.addingChildArrowFrom}
          requestCreateNode={noop}
          onAddConnection={noop}
          onCancelConnection={noop}
          onClickNode={onClickNode}
          onDoubleClickNode={onDoubleClickNode}
          getContextItems={this.getContextItems}
          ref={(ref) => { this.networkRef = ref; }}
        >
          {this.renderAddingChildArrow()}
        </Network>
      </div>
    );
  }
}

SubNetwork.defaultProps = {
  linkedNodes: [],
  networkColor: '',
  onSetBelief: noop,
  onDoubleClickNode: noop,
  onClickNode: noop,
  connectingNode: null,
};

SubNetwork.propTypes = {
  network: networkPropTypes.isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes).isRequired,
  connecting: PropTypes.bool.isRequired,
  connectingNode: nodePropTypes,
  inferenceResults: subNetworkInferenceResultsPropTypes.isRequired,
  networkColor: PropTypes.string,
  linkedNodes: PropTypes.arrayOf(linkedNodePropTypes),
  onSetBelief: PropTypes.func,
  onDoubleClickNode: PropTypes.func,
  onClickNode: PropTypes.func,
};

export default SubNetwork;
