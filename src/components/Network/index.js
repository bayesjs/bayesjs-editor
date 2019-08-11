import React, { PureComponent } from 'react';
import {
  arrowPropTypes,
  networkPropTypes,
  nodePropTypes,
  subnetworkPropTypes,
} from 'models';
import { isFunction, noop } from 'lodash';

import ArrowMovingPlaceholder from 'components/ArrowMovingPlaceholder';
import Arrows from 'components/Arrows';
import ContextMenu from 'components/ContextMenu';
import NodeMovingPlaceholder from 'components/NodeMovingPlaceholder';
import Nodes from 'components/Nodes';
import PropTypes from 'prop-types';
import { propEq } from 'ramda';
import styles from './styles.css';

export const ContextMenuType = {
  NODE: 'CONTEXT_MENU_NODE',
  ARROW: 'CONTEXT_MENU_ARROW',
  CANVAS: 'CONTEXT_MENU_CANVAS',
};

class Network extends PureComponent {
  state = {
    contextMenuItems: [],
    movingNode: null,
    nodeToAddChildTo: null,
    newNode: null,
    svgRef: null,
  };

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

  handleArrowMouseDown = (e, arrow) => {
    if (e.button === 2) {
      const { getContextItems } = this.props;
      e.stopPropagation();

      this.contextMenuArrow = arrow;
      this.setState({ contextMenuItems: getContextItems(ContextMenuType.ARROW) });
      this.contextMenu.handleContainerMouseDown(e, arrow);
    }
  };

  handleNodeMouseDown = (node, e) => {
    e.stopPropagation();
    const {
      onClickNode,
      onSelectNodes,
      getContextItems,
    } = this.props;

    onSelectNodes([node.id]);
    if (typeof onClickNode === 'function') {
      onClickNode(node, e);
    }

    if (e.button === 0) {
      this.contextMenu.hide();
      this.onStartMovingNode(node);
    } else if (e.button === 2) {
      this.contextMenuNode = node;
      this.setState({ contextMenuItems: getContextItems(ContextMenuType.NODE) });
      this.contextMenu.handleContainerMouseDown(e, node);
    }
  };

  onStartMovingNode = (movingNode) => {
    if (this.canChangeNodePosition) {
      this.setState({ movingNode });
    }
  }

  onStopMovingNode = () => {
    this.setState({ movingNode: null });
  }

  handleMouseDown = (e) => {
    const { onSelectNodes, getContextItems } = this.props;
    const { svgRef } = this.state;

    // Use setTimeout to ensure that the blur event of inputs in the properties panel is fired.
    setTimeout(() => {
      onSelectNodes([]);
    }, 0);

    if (e.button === 2) {
      const rect = svgRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.contextMenuPosition = { x, y };
      this.setState({ contextMenuItems: getContextItems(ContextMenuType.CANVAS) });
      this.contextMenu.handleContainerMouseDown(e, this.contextMenuPosition);
    }
  };

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
    } = this.props;
    const { contextMenuItems, newNode } = this.state;

    return (
      <div>
        <svg
          className={styles.canvas}
          onContextMenu={e => e.preventDefault()}
          onMouseDown={this.handleMouseDown}
          height={network.height}
          width={network.width}
          ref={this.handleRef}
        >
          <g>
            <Arrows
              arrows={arrows}
              onMouseDown={this.handleArrowMouseDown}
            />
          </g>
          <g>
            <Nodes
              nodes={nodes}
              onMouseDown={this.handleNodeMouseDown}
              onDoubleClick={onDoubleClickNode}
              onStateDoubleClick={onStateDoubleClick}
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

        <ContextMenu
          ref={(ref) => { this.contextMenu = ref; }}
          items={contextMenuItems}
        />

        {newNode}
        {children}
      </div>
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
  getContextItems: PropTypes.func.isRequired,
  onDoubleClickNode: PropTypes.func,
  changeNodePosition: PropTypes.func,
  onClickNode: PropTypes.func,
  onStateDoubleClick: PropTypes.func,
  addingChildArrow: nodePropTypes,
};

export default Network;
