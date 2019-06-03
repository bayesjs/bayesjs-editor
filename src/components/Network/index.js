import React, { PureComponent } from 'react';
import {
  arrowPropTypes,
  networkPropTypes,
  nodePropTypes,
  positionPropTypes,
  subnetworkPropTypes,
} from 'models';

import ArrowPlaceholder from 'components/ArrowPlaceholder';
import Arrows from 'components/Arrows';
import ContextMenu from 'components/ContextMenu';
import NodeMovingPlaceholder from 'components/NodeMovingPlaceholder';
import Nodes from 'components/Nodes';
import PropTypes from 'prop-types';
import { noop, isFunction } from 'lodash';
import { propEq } from 'ramda';
import styles from './styles.css';

export const ContextMenuType = {
  NODE: 'CONTEXT_MENU_NODE',
  ARROW: 'CONTEXT_MENU_ARROW',
  CANVAS: 'CONTEXT_MENU_CANVAS',
};

class Network extends PureComponent {
  constructor(props) {
    super(props);
    const { changeNodePosition, onMouseMove } = this.props;

    this.state = {
      addingChildArrow: null,
      contextMenuItems: [],
      movingNode: null,
      nodeToAddChildTo: null,
      newNode: null,
    };

    this.rectRefs = {};
    this.canChangeNodePostion = typeof changeNodePosition === 'function';
    this.onMouseMoveProps = typeof onMouseMove === 'function' ? onMouseMove : noop;
  }

  get canChangeNodePosition() {
    const { changeNodePosition } = this.props;

    return isFunction(changeNodePosition);
  }

  handleRef = (svgRef) => {
    this.svgRef = svgRef;
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
      const rect = this.svgRef.getBoundingClientRect();
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
    this.handleNodeToAddChildTo(nodeToAddChildTo, e);
  };

  getFrom = (nodes, nodeToAddChildTo, addingChildArrowFrom) => {
    if (addingChildArrowFrom) return addingChildArrowFrom;

    const { size, position } = nodes.find(propEq('id', nodeToAddChildTo.id));

    return {
      x: position.x + (size.width / 2),
      y: position.y + (size.height / 2),
    };
  }

  handleNodeToAddChildTo = (nodeToAddChildTo, e) => {
    const { nodes, addingChildArrowFrom } = this.props;

    if (nodeToAddChildTo || addingChildArrowFrom) {
      const canvasRect = this.svgRef.getBoundingClientRect();
      const from = this.getFrom(nodes, nodeToAddChildTo, addingChildArrowFrom);

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

  handleMouseLeave = () => {
    const { onCancelConnection } = this.props;
    const { nodeToAddChildTo } = this.state;

    if (nodeToAddChildTo !== null) {
      onCancelConnection();
      this.setState({ addingChildArrow: null, nodeToAddChildTo: null });
    }
  };

  handleSetNodePosition = ({ x, y }) => {
    const { changeNodePosition } = this.props;
    const { movingNode } = this.state;
    const { id } = movingNode;

    changeNodePosition(id, x, y);
    this.onStopMovingNode();
  }

  renderAddingChildArrow = () => {
    const { addingChildArrow } = this.state;

    return addingChildArrow && <ArrowPlaceholder {...addingChildArrow} />;
  }

  renderMovingNodePlaceholder = () => {
    const { movingNode } = this.state;

    return movingNode && (
      <NodeMovingPlaceholder
        svg={this.svgRef}
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
          onMouseMove={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
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
  onMouseMove: noop,
  onDoubleClickNode: noop,
  changeNodePosition: null,
  onClickNode: noop,
  onStateDoubleClick: noop,
  onSelectNodes: noop,
  addingChildArrowFrom: null,
  children: null,
};

Network.propTypes = {
  network: networkPropTypes.isRequired,
  children: PropTypes.element,
  nodes: PropTypes.arrayOf(PropTypes.oneOfType([nodePropTypes, subnetworkPropTypes])).isRequired,
  arrows: PropTypes.arrayOf(arrowPropTypes).isRequired,
  requestCreateNode: PropTypes.func.isRequired,
  onAddConnection: PropTypes.func.isRequired,
  onCancelConnection: PropTypes.func.isRequired,
  onSelectNodes: PropTypes.func,
  getContextItems: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func,
  onDoubleClickNode: PropTypes.func,
  changeNodePosition: PropTypes.func,
  onClickNode: PropTypes.func,
  onStateDoubleClick: PropTypes.func,
  addingChildArrowFrom: positionPropTypes,
};

export default Network;
