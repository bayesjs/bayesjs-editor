import React, { PureComponent } from 'react';
import {
  arrowPropTypes,
  contextMenuItemPropTypes,
  networkPropTypes,
  nodePropTypes,
  subnetworkPropTypes,
} from '@models';
import { isFunction, noop } from 'lodash';

import ArrowMovingPlaceholder from '@components/ArrowMovingPlaceholder';
import Arrows from '@components/Arrows';
import { CONTEXTMENU_TYPES } from '@constants/contextmenu';
import ContextMenu from '@components/ContextMenu';
import NodeMovingPlaceholder from '@components/NodeMovingPlaceholder';
import Nodes from '@components/Nodes';
import PropTypes from 'prop-types';
import { propEq } from 'ramda';
import styles from './styles.css';
import { v4 } from 'uuid';

class Network extends PureComponent {
  state = {
    movingNode: null,
    nodeToAddChildTo: null,
    newNode: null,
    svgRef: null,
  };

  contextMenuId = v4();

  get canChangeNodePosition() {
    const { changeNodePosition } = this.props;

    return isFunction(changeNodePosition);
  }

  handleRef = (svgRef) => {
    this.setState({ svgRef });
  }

  startConnection = (nodeToAddChildTo) => {
    this.setState({ nodeToAddChildTo });
  };

  createNode = (newNodePosition) => {
    const { requestCreateNode } = this.props;
    const newNode = requestCreateNode(newNodePosition, () => this.setState({ newNode: null }));

    if (newNode) {
      this.setState({ newNode });
    }
  };

  handleNodeMouseDown = (node, e) => {
    e.stopPropagation();
    const {
      onClickNode,
      onSelectNodes,
    } = this.props;

    onSelectNodes([node.id]);

    if (typeof onClickNode === 'function') {
      onClickNode(node, e);
    }

    this.onStartMovingNode(node);
  };

  onStartMovingNode = (movingNode) => {
    if (this.canChangeNodePosition) {
      this.setState({ movingNode });
    }
  }

  onStopMovingNode = () => {
    this.setState({ movingNode: null });
  }

  handleMouseDown = () => {
    const { onSelectNodes } = this.props;

    onSelectNodes([]);
  }

  getFrom = (nodes, nodeToAddChildTo, addingChildArrow) => {
    if (addingChildArrow) return addingChildArrow;

    const { size, position } = nodes.find(propEq('id', nodeToAddChildTo.id));

    return {
      x: position.x + (size.width / 2),
      y: position.y + (size.height / 2),
    };
  }

  handleSetAddingChildArrow = connectiongNode => ({ node }) => {
    const {
      onAddConnection,
      onCancelConnection,
    } = this.props;
    const { nodeToAddChildTo } = this.state;

    if (node) {
      onAddConnection(node.id, connectiongNode.id);
    }

    if (nodeToAddChildTo) {
      this.setState({ nodeToAddChildTo: null });
    }

    onCancelConnection();
  }

  handleSetNodePosition = ({ x, y }) => {
    const { changeNodePosition } = this.props;
    const { movingNode } = this.state;
    const { id } = movingNode;

    changeNodePosition(id, x, y);
    this.onStopMovingNode();
  }

  renderAddingChildArrow = () => {
    const { nodes, addingChildArrow } = this.props;
    const { nodeToAddChildTo, svgRef } = this.state;
    const connectiongNode = nodeToAddChildTo || addingChildArrow;

    return connectiongNode && (
      <ArrowMovingPlaceholder
        svg={svgRef}
        node={connectiongNode}
        nodes={nodes}
        onSetPosition={this.handleSetAddingChildArrow(connectiongNode)}
      />
    );
  }

  renderMovingNodePlaceholder = () => {
    const { movingNode, svgRef } = this.state;

    return movingNode && (
      <NodeMovingPlaceholder
        svg={svgRef}
        node={movingNode}
        onSetPosition={this.handleSetNodePosition}
        onCancel={this.onStopMovingNode}
      />
    );
  }

  render() {
    const {
      network,
      children,
      arrows,
      nodes,
      onDoubleClickNode,
      onStateDoubleClick,
      contextXOffset,
      contextYOffset,
      networkContextItems,
      nodeContextItems,
      arrowContextItems,
    } = this.props;
    const { newNode } = this.state;

    return (
      <ContextMenu
        id={this.contextMenuId}
        type={CONTEXTMENU_TYPES.NETWORK}
        posX={contextXOffset}
        posY={contextYOffset}
        items={networkContextItems}
      >
        <svg
          className={styles.canvas}
          height={network.height}
          width={network.width}
          onMouseDown={this.handleMouseDown}
          ref={this.handleRef}
        >
          <g>
            <Arrows
              arrows={arrows}
              contextItems={arrowContextItems}
            />
          </g>
          <g>
            <Nodes
              nodes={nodes}
              onMouseDown={this.handleNodeMouseDown}
              onDoubleClick={onDoubleClickNode}
              onStateDoubleClick={onStateDoubleClick}
              contextItems={nodeContextItems}
            />
          </g>
          <g>
            {this.renderAddingChildArrow()}
          </g>
          <g>
            {this.renderMovingNodePlaceholder()}
          </g>
          <g>
            {children}
          </g>
        </svg>

        {newNode}
        {children}
      </ContextMenu>
    );
  }
}

Network.defaultProps = {
  onDoubleClickNode: noop,
  changeNodePosition: null,
  onClickNode: noop,
  onStateDoubleClick: noop,
  onSelectNodes: noop,
  addingChildArrow: null,
  children: null,
  onCancelConnection: noop,
  onAddConnection: noop,
  requestCreateNode: noop,
  arrowContextItems: [],
  networkContextItems: [],
  nodeContextItems: [],
  contextXOffset: 0,
  contextYOffset: 0,
};

Network.propTypes = {
  network: networkPropTypes.isRequired,
  children: PropTypes.element,
  nodes: PropTypes.arrayOf(PropTypes.oneOfType([nodePropTypes, subnetworkPropTypes])).isRequired,
  arrows: PropTypes.arrayOf(arrowPropTypes).isRequired,
  requestCreateNode: PropTypes.func,
  onAddConnection: PropTypes.func,
  onCancelConnection: PropTypes.func,
  onSelectNodes: PropTypes.func,
  arrowContextItems: PropTypes.arrayOf(contextMenuItemPropTypes),
  networkContextItems: PropTypes.arrayOf(contextMenuItemPropTypes),
  nodeContextItems: PropTypes.arrayOf(contextMenuItemPropTypes),
  onDoubleClickNode: PropTypes.func,
  changeNodePosition: PropTypes.func,
  onClickNode: PropTypes.func,
  onStateDoubleClick: PropTypes.func,
  addingChildArrow: nodePropTypes,
  contextXOffset: PropTypes.number,
  contextYOffset: PropTypes.number,
};

export default Network;
