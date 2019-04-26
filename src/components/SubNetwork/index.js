import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { networkPropTypes, nodePropTypes } from 'models';
import { getArrowsPositions } from 'utils/arrows-positions';
import { getNodeSize } from 'utils/node-size';
import Network, { ContextMenuType } from '../Network';

import Node from '../Node';
import NodeGeneric from '../NodeGeneric';

class SubNetwork extends Component {
  constructor(props) {
    super(props);
    const { connecting, onDoubleClickNode } = props;

    this.state = {
      selectedNodeId: null,
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

  handleMouseMove = (e) => {
    const { connectingNode } = this.props;

    if (connectingNode) {
      const canvasRect = this.networkRef.canvas.getBoundingClientRect();
      const nodeRect = this.connectingNodeRef.getBoundingClientRect();

      const from = {
        x: nodeRect.left + (nodeRect.width / 2) - canvasRect.left,
        y: nodeRect.top + (nodeRect.height / 2) - canvasRect.top,
      };

      const to = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      };

      // Without it, sometimes the mouse is over the adding arrow
      // It needs to be over the node to be added
      to.x += from.x < to.x ? -3 : 3;
      to.y += from.y < to.y ? -3 : 3;

      this.setState({
        addingChildArrow: { from, to },
      });
    }
  };

  onSelectNodes = (nodes) => {
    const selectedNodeId = nodes.length > 0 ? nodes[0] : null;

    this.setState({ selectedNodeId });
  };

  getLinkedFromNode = ({ id }) => {
    const { linkedNodes } = this.props;

    return linkedNodes.find(({ nodeId }) => nodeId === id);
  };

  getLinkTitle = ({ connections }) => connections.reduce((p, c) => {
    const message = `${c.networkName} - ${c.nodeId}`;
    p += message;
    return p;
  }, '');

  onSetBelief = node => (state) => {
    const { connecting, onSetBelief, network } = this.props;

    if (!connecting && onSetBelief) {
      onSetBelief(network, node, state);
    }
  }

  renderNode = (node, props) => {
    const {
      connectingNode, network, inferenceResults, networkColor,
    } = this.props;
    const { selectedNodeId } = this.state;
    const key = `${network.name}-${node.id}`;

    if (connectingNode === node) {
      const { network: { name, color } } = connectingNode;

      return (
        <NodeGeneric
          key={`${key}-view`}
          x="5"
          y="5"
          id={name}
          selected
          stroke={color}
          onMouseDown={() => { }}
          rectRef={(ref) => { this.connectingNodeRef = ref; }}
          canMove
          opacity="0.3"
        >
          <foreignObject x="5" y="21" height="15" width="150">
            <p
              title={connectingNode.id}
              style={{
                margin: 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {connectingNode.id}
            </p>
          </foreignObject>
        </NodeGeneric>
      );
    }

    let child = null;

    if (node.link) {
      // (18 * states.length) + 25
      const circles = node.link.connections.map(({ networkName, color }, i) => (
        <circle key={networkName} cx={75 + (20 * i)} cy={(18 * node.states.length) + 45} r="8" fill={color}>
          <title>{`Rede: ${networkName}`}</title>
        </circle>
      ));

      child = (
        <g>
          <text x="5" y={(18 * node.states.length) + 50}>Uniões:</text>
          <path d={`M0,${(18 * node.states.length) + 30} h160`} stroke="#333" />
          {circles}
        </g>
      );
    }

    return (
      <Node
        key={key}
        results={inferenceResults[node.id]}
        selected={selectedNodeId === node.id}
        belief={network.beliefs[node.id]}
        onStateDoubleClick={this.onSetBelief(node)}
        stroke={networkColor}
        canMove={false}
        opacity="0.3"
        {...node}
        {...props}
      >
        {child}
      </Node>
    );
  };

  getContextItems = (type) => {
    switch (type) {
      case ContextMenuType.NODE:
        return this.nodeContextMenuItems;
      default:
        return [];
    }
  }

  getNodes = () => {
    const { connectingNode, nodes } = this.props;
    const finalNodes = nodes.map((node) => {
      const link = this.getLinkedFromNode(node);
      const size = getNodeSize({ ...node, link });

      return {
        ...node,
        link,
        size,
      };
    });

    if (connectingNode) {
      return [
        ...finalNodes,
        connectingNode,
      ];
    }

    return finalNodes;
  };

  renderAddingChildArrow = () => {
    const { addingChildArrow } = this.state;

    if (addingChildArrow !== null) {
      const { from, to } = addingChildArrow;

      return (
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

    return null;
  }

  render() {
    const { network, onClickNode, onDoubleClickNode } = this.props;
    const empty = () => { };
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
          nodes={this.getNodes()}
          arrows={getArrowsPositions(this.getNodes())}
          renderNode={this.renderNode}
          requestCreateNode={empty}
          onAddConnection={empty}
          onCancelConnection={empty}
          onSelectNodes={this.onSelectNodes}
          onClickNode={onClickNode}
          onDoubleClickNode={onDoubleClickNode}
          getContextItems={this.getContextItems}
          onMouseMove={this.handleMouseMove}
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
  onSetBelief: () => { },
  onDoubleClickNode: () => { },
  onClickNode: () => { },
};

SubNetwork.propTypes = {
  network: networkPropTypes.isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes).isRequired,
  connecting: PropTypes.bool.isRequired,
  connectingNode: nodePropTypes.isRequired,
  inferenceResults: PropTypes.objectOf(PropTypes.number).isRequired,
  networkColor: PropTypes.string,
  linkedNodes: PropTypes.arrayOf(PropTypes.string),
  onSetBelief: PropTypes.func,
  onDoubleClickNode: PropTypes.func,
  onClickNode: PropTypes.func,
};

export default SubNetwork;
