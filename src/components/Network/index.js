import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { networkPropTypes, nodePropTypes } from 'models';
import Arrows from '../Arrows';
import ContextMenu from '../ContextMenu';
import styles from './styles.css';

export const ContextMenuType = {
  NODE: 'CONTEXT_MENU_NODE',
  ARROW: 'CONTEXT_MENU_ARROW',
  CANVAS: 'CONTEXT_MENU_CANVAS',
};


class Network extends Component {
  constructor(props) {
    super(props);
    const { changeNodePosition, onMouseMove } = this.props;

    this.state = {
      addingChildArrow: null,
      contextMenuItems: [],
      movingNodePlaceholder: null,
      nodeToAddChildTo: null,
      newNode: null,
    };

    this.rectRefs = {};
    this.movingNode = null;
    this.canChangeNodePostion = typeof changeNodePosition === 'function';
    this.onMouseMoveProps = typeof onMouseMove === 'function' ? onMouseMove : () => { };
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
      onClickNode, onSelectNodes, onAddConnection, getContextItems,
    } = this.props;
    const { nodeToAddChildTo } = this.state;

    onSelectNodes([node.id]);
    if (typeof onClickNode === 'function') {
      onClickNode(node, e);
    }

    if (e.button === 0) {
      this.contextMenu.hide();

      if (nodeToAddChildTo !== null) {
        onAddConnection(node.id, nodeToAddChildTo.id);
        this.setState({ addingChildArrow: null, nodeToAddChildTo: null });
      }

      this.movingNode = {
        id: node.id,
        initialPosition: {
          x: node.position.x,
          y: node.position.y,
        },
        initialMousePosition: {
          x: e.clientX,
          y: e.clientY,
        },
      };
    } else if (e.button === 2) {
      this.contextMenuNode = node;
      this.setState({ contextMenuItems: getContextItems(ContextMenuType.NODE) });
      this.contextMenu.handleContainerMouseDown(e, node);
    }
  };

  handleMouseDown = (e) => {
    const { onSelectNodes, onCancelConnection, getContextItems } = this.props;
    const { nodeToAddChildTo } = this.state;

    // Use setTimeout to ensure that the blur event of inputs in the properties panel is fired.
    setTimeout(() => {
      onSelectNodes([]);
    }, 0);

    if (nodeToAddChildTo !== null) {
      onCancelConnection();
      this.setState({ addingChildArrow: null, nodeToAddChildTo: null });
    }

    if (e.button === 2) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.contextMenuPosition = { x, y };
      this.setState({ contextMenuItems: getContextItems(ContextMenuType.CANVAS) });
      this.contextMenu.handleContainerMouseDown(e, this.contextMenuPosition);
    }
  };

  handleMouseMove = (e) => {
    const { nodeToAddChildTo } = this.state;
    this.onMouseMoveProps(e);

    if (this.canChangeNodePostion && this.movingNode !== null) {
      const { id, initialPosition, initialMousePosition } = this.movingNode;
      const nodeRect = this.rectRefs[id].getBoundingClientRect();

      const difX = e.clientX - initialMousePosition.x;
      const difY = e.clientY - initialMousePosition.y;

      const movingNodePlaceholder = {
        x: initialPosition.x + difX,
        y: initialPosition.y + difY,
        height: nodeRect.height,
        width: nodeRect.width,
      };

      this.setState({ movingNodePlaceholder });
    }

    this.handleNodeToAddChildTo(nodeToAddChildTo, e);
  };

  handleNodeToAddChildTo = (nodeToAddChildTo, e) => {
    if (nodeToAddChildTo !== null) {
      const canvasRect = this.canvas.getBoundingClientRect();
      const nodeRect = this.rectRefs[nodeToAddChildTo.id].getBoundingClientRect();

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
  }

  handleMouseUp = (e) => {
    if (this.movingNode !== null) {
      const { id, initialPosition, initialMousePosition } = this.movingNode;
      const { changeNodePosition } = this.props;

      const difX = e.clientX - initialMousePosition.x;
      const difY = e.clientY - initialMousePosition.y;

      const newX = initialPosition.x + difX;
      const newY = initialPosition.y + difY;

      if (this.canChangeNodePostion) {
        changeNodePosition(id, newX, newY);
      } else {
        console.warn('changeNodePosition not defined in the props of Network');
      }

      this.setState({ movingNodePlaceholder: null });
      this.movingNode = null;
    }
  };

  handleMouseLeave = () => {
    const { onCancelConnection } = this.props;
    const { nodeToAddChildTo } = this.state;

    if (this.movingNode !== null) {
      this.movingNode = null;
      this.setState({ movingNodePlaceholder: null });
    }

    if (nodeToAddChildTo !== null) {
      onCancelConnection();
      this.setState({ addingChildArrow: null, nodeToAddChildTo: null });
    }
  };

  renderDefs = () => (
    <defs>
      <marker
        id="triangle"
        viewBox="0 0 10 10"
        markerWidth="6"
        markerHeight="6"
        refX="8"
        refY="5"
        orient="auto"
      >
        <path d="M0,0 L10,5 L0,10" fill="#333" />
      </marker>

      <marker
        id="triangle-hover"
        viewBox="0 0 10 10"
        markerWidth="6"
        markerHeight="6"
        refX="8"
        refY="5"
        orient="auto"
      >
        <path d="M0,0 L10,5 L0,10" fill="#9f9ff6" />
      </marker>
    </defs>
  );

  renderNodes = () => {
    const { nodes, renderNode, onDoubleClickNode } = this.props;
    const setRef = nodeId => (nodeRef) => {
      this.rectRefs[nodeId] = nodeRef;
    };
    this.rectRefs = {};

    return nodes.map((node) => {
      const rectRef = setRef(node.id);
      const onMouseDown = e => this.handleNodeMouseDown(node, e);
      const onDoubleClick = (e) => {
        if (typeof onDoubleClickNode === 'function') {
          onDoubleClickNode(node, e);
        }
      };

      return renderNode(node, { rectRef, onMouseDown, onDoubleClick });
    });
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

  renderMovingNodePlaceholder = () => {
    const { movingNodePlaceholder } = this.state;

    if (movingNodePlaceholder !== null) {
      const {
        x, y, height, width,
      } = movingNodePlaceholder;

      return (
        <rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill="none"
          stroke="#333"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      );
    }
    return null;
  }

  render() {
    const { network, children, arrows } = this.props;
    const { contextMenuItems, newNode } = this.state;

    return (
      <div>
        <svg
          className={styles.canvas}
          onContextMenu={e => e.preventDefault()}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseLeave}
          height={network.height}
          width={network.width}
          ref={(ref) => { this.canvas = ref; }}
        >
          <g>
            <Arrows arrows={arrows} onMouseDown={this.handleArrowMouseDown} />
          </g>
          <g>
            {this.renderNodes()}
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
  onMouseMove: () => { },
  onDoubleClickNode: () => { },
  changeNodePosition: () => { },
  onClickNode: () => { },
};

Network.propTypes = {
  network: networkPropTypes.isRequired,
  children: PropTypes.element.isRequired,
  nodes: PropTypes.objectOf(nodePropTypes).isRequired,
  arrows: PropTypes.func.isRequired,
  renderNode: PropTypes.func.isRequired,
  requestCreateNode: PropTypes.func.isRequired,
  onAddConnection: PropTypes.func.isRequired,
  onCancelConnection: PropTypes.func.isRequired,
  onSelectNodes: PropTypes.func.isRequired,
  getContextItems: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func,
  onDoubleClickNode: PropTypes.func,
  changeNodePosition: PropTypes.func,
  onClickNode: PropTypes.func,
};

export default Network;
