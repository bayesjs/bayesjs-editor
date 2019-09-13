import Network from 'components/Network';
import React, { Component } from 'react';
import Modal from 'components/Modal';
import {
  linkedNodePropTypes,
  networkPropTypes,
  nodePropTypes,
  subNetworkInferenceResultsPropTypes,
} from 'models';
import { propEq } from 'ramda';

import PropTypes from 'prop-types';
import { getArrowsPositions } from 'utils/arrows-positions';
import { getNodeSize } from 'utils/node-size';
import { noop } from 'lodash';


class SubNetwork extends Component {
  state = {
    modalXOffset: 0,
    modalYOffset: 0,
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
      connectingNode,
      network,
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

  get addingChildArrow() {
    const { connectingNode } = this.props;

    if (connectingNode) {
      const node = this.nodes.find(propEq('id', connectingNode.id));

      return {
        ...node,
        position: { x: 5, y: 5 },
      };
    }

    return null;
  }

  get nodeContextItems() {
    const { connecting, onDoubleClickNode } = this.props;

    return [
      {
        key: 'connect-node',
        text: 'Unir',
        disabled: !connecting,
        onClick: (_, contextMenuNode) => {
          onDoubleClickNode(contextMenuNode);
        },
      },
      {
        key: 'linkages-node',
        text: 'Ver Uniões',
        disabled: ({ link }) => link,
        onClick: () => {
          window.alert('Nao implementado');
        },
      },
    ];
  }

  get title() {
    const { network: { name } } = this.props;
    return `Subrede ${name}`;
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

  handleContentRef = (element) => {
    if (element) {
      const { offsetWidth, offsetHeight } = element;

      this.setState({
        modalXOffset: (window.innerWidth - offsetWidth) / 2,
        modalYOffset: (window.innerHeight - offsetHeight) / 2,
      });
    }
  }

  render() {
    const { modalXOffset, modalYOffset } = this.state;
    const {
      network,
      onClickNode,
      onDoubleClickNode,
      onRequestClose,
    } = this.props;

    return (
      <Modal
        title={this.title}
        onRequestClose={onRequestClose}
        isOpen={network !== null}
        contentRef={this.handleContentRef}
      >
        <Network
          network={network}
          nodes={this.nodes}
          arrows={getArrowsPositions(this.nodes)}
          onStateDoubleClick={this.onSetBelief}
          addingChildArrow={this.addingChildArrow}
          onClickNode={onClickNode}
          onDoubleClickNode={onDoubleClickNode}
          nodeContextItems={this.nodeContextItems}
          contextXOffset={modalXOffset}
          contextYOffset={modalYOffset}
          ref={(ref) => { this.networkRef = ref; }}
        />
      </Modal>
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
  onRequestClose: noop,
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
  onRequestClose: PropTypes.func,
};

export default SubNetwork;
