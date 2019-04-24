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
      arrows: [],
      addingChildArrow: null,
      contextMenuItems: [],
      movingNodePlaceholder: null,
      nodeToAddChildTo: null,
      newNode: null,
    };

    this.rectRefs = {};
    this.movingNode = null;
    this.canChangeNodePostion = typeof changeNodePosition === 'function';
    this.onMouseMoveProps = typeof onMouseMove === 'function' ? onMouseMove : () => {};
  }

  componentDidMount() {
    this.renderArrows();
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

  calculateArrows = () => {
    const { arrows } = this.props;
    if (Object.keys(this.rectRefs).length === 0) return [];

    const getNodeLinksPositions = (node) => {
      const { height, width } = this.rectRefs[node.id].getBoundingClientRect();

      const top = {
        x: (node.position.x + width / 2),
        y: node.position.y,
        type: 'top',
      };

      const right = {
        x: node.position.x + width,
        y: (node.position.y + height / 2),
        type: 'right',
      };

      const bottom = {
        x: (node.position.x + width / 2),
        y: node.position.y + height,
        type: 'bottom',
      };

      const left = {
        x: node.position.x,
        y: (node.position.y + height / 2),
        type: 'left',
      };

      return [top, right, bottom, left];
    };

    const getDistance = (p1, p2) => (
      Math.sqrt((Math.abs(p2.x - p1.x) ** 2) + (Math.abs(p2.y - p1.y) ** 2))
    );

    const getNearestPoints = (node1, node2) => {
      const ps1 = getNodeLinksPositions(node1);
      const ps2 = getNodeLinksPositions(node2);

      let p1 = ps1[0];
      let p2 = ps2[0];

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (getDistance(p1, p2) > getDistance(ps1[i], ps2[j])) {
            p1 = ps1[i];
            p2 = ps2[j];
          }
        }
      }

      return { p1, p2 };
    };

    return arrows().map((arrow, index) => {
      const { from, to } = arrow;
      const points = getNearestPoints(from, to);

      return {
        key: `${from.id}-${to.id}`,
        from: points.p1,
        to: points.p2,
        parentId: from.id,
        childId: to.id,
        arrow,
        index,
      };
    });
  };

  handleArrowMouseDown = (arrow, e) => {
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
        setTimeout(() => this.calculateArrows(), 0);
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

        setTimeout(() => this.calculateArrows(), 0);
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

  renderArrows = () => {
    const { onClickArrow, nodes, renderArrow } = this.props;
    const arrowsCalc = this.calculateArrows(nodes);
    const clickIsFunc = onClickArrow === 'function';
    const arrows = arrowsCalc.map((a) => {
      const onMouseDown = e => this.handleArrowMouseDown(a, e);
      const onClick = (e) => {
        if (clickIsFunc) {
          onClickArrow(a, e);
        }
      };

      return renderArrow(a, { onMouseDown, onClick });
    });

    this.setState({ arrows });
  };

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
    const { network, children } = this.props;
    const { arrows, contextMenuItems, newNode } = this.state;

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
            <Arrows arrows={arrows} />
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
  onMouseMove: () => {},
  onDoubleClickNode: () => {},
  onClickArrow: () => {},
  changeNodePosition: () => {},
  onClickNode: () => {},
};

Network.propTypes = {
  network: networkPropTypes.isRequired,
  children: PropTypes.element.isRequired,
  nodes: PropTypes.objectOf(nodePropTypes).isRequired,
  arrows: PropTypes.func.isRequired,
  renderArrow: PropTypes.func.isRequired,
  renderNode: PropTypes.func.isRequired,
  requestCreateNode: PropTypes.func.isRequired,
  onAddConnection: PropTypes.func.isRequired,
  onCancelConnection: PropTypes.func.isRequired,
  onSelectNodes: PropTypes.func.isRequired,
  getContextItems: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func,
  onDoubleClickNode: PropTypes.func,
  onClickArrow: PropTypes.func,
  changeNodePosition: PropTypes.func,
  onClickNode: PropTypes.func,
};

export default Network;
