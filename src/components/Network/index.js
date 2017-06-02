import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.css';
import ContextMenu from '../ContextMenu';
import AddNodeModal from '../AddNodeModal';
import Arrows from '../Arrows';
import { v4 } from 'uuid';

export const ContextMenuType = {
  NODE: 'CONTEXT_MENU_NODE',
  ARROW: 'CONTEXT_MENU_ARROW',
  CANVAS: 'CONTEXT_MENU_CANVAS'
};

import {
  getNetwork,
  getNodesWithPositions,
  getInferenceResults,
} from '../../selectors';

class Network extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arrows: [],
      addingChildArrow: null,
      contextMenuItems: [],
      movingNodePlaceholder: null,
      nodeToAddChildTo: null,
      newNode: null
    };

    this.rectRefs = {};
    this.movingNode = null;
    this.canChangeNodePostion = typeof this.props.changeNodePosition === 'function';
    this.onMouseMoveProps = typeof this.props.onMouseMove === 'function' ? this.props.onMouseMove : () => {};
  }

  componentDidMount() {
    this.renderArrows();
  }

  startConnection = (nodeToAddChildTo) => {
    this.setState({ nodeToAddChildTo });
  };

  createNode = (newNodePosition) => {
    const newNode = this.props.requestCreateNode(newNodePosition, () => this.setState({ newNode: null }));
    
    if (newNode) {
      this.setState({ newNode });
    }
  };

  calculateArrows = (nodes = this.props.nodes) => {
    if (Object.keys(this.rectRefs).length == 0) return [];
    
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

    const corretion = (p, value) => {
      if (['top', 'bottom'].indexOf(p.type) !== -1) {
        p.x += value;
      } else {
        p.y += value;
      }
    }

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
      
      // corretion(p1, -10);
      // corretion(p2, 10);

      return { p1, p2 };
    };

    const pointCountArray = [];

    const getPointCount = point => {
      let pointCount = pointCountArray
        .find(x => x.point.x === point.x && x.point.y === point.y);

      if (pointCount !== undefined) {
        pointCount.count++;
      } else {
        pointCount = {
          point,
          count: 1,
        };

        pointCountArray.push(pointCount);
      }

      return pointCount.count;
    };

    const getPointAdjustment = count => {
      let adjustment = count - 1;

      if (adjustment % 2 === 1) {
        adjustment *= -1;
        adjustment -= 1;
      }

      adjustment /= 2;

      return adjustment * 12;
    };

    const adjustPoint = (point, adjustment) => {
      if (point.type === 'top' || point.type === 'bottom') {
        point.x += adjustment;
      } else {
        point.y += adjustment;
      }
    };

    const arrows = this.props.arrows().map((arrow, index) => {
      const { from, to } = arrow;
      const points = getNearestPoints(from, to);
      // const pointsFrom = map.get(from.id) || [];
      // const seila = map.get(from.id) || [];
      
      // const p1Adjustment = getPointAdjustment(getPointCount(points.p1));
      // const p2Adjustment = getPointAdjustment(getPointCount(points.p2));

      // adjustPoint(points.p1, p1Adjustment);
      // adjustPoint(points.p2, p2Adjustment);

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

    return arrows;
  };

  handleArrowMouseDown = (arrow, e) => {
    if (e.button === 2) {
      e.stopPropagation();

      this.contextMenuArrow = arrow;
      this.setState({ contextMenuItems: this.props.getContextItems(ContextMenuType.ARROW) });
      this.contextMenu.handleContainerMouseDown(e, arrow);
    }
  };

  handleNodeMouseDown = (node, e) => {
    e.stopPropagation();
    const { onClickNode, onSelectNodes, onAddConnection, getContextItems } = this.props;

    onSelectNodes([node.id]);
    if (typeof onClickNode === 'function') {
      onClickNode(node, e);
    }

    if (e.button === 0) {
      this.contextMenu.hide();

      if (this.state.nodeToAddChildTo !== null) {
        onAddConnection(node.id, this.state.nodeToAddChildTo.id);
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

  handleMouseDown = e => {
    // Use setTimeout to ensure that the blur event of inputs in the properties panel is fired.
    setTimeout(() => {
      this.props.onSelectNodes([]);
    }, 0);

    if (this.state.nodeToAddChildTo !== null) {
      this.props.onCancelConnection();
      this.setState({ addingChildArrow: null, nodeToAddChildTo: null });
    }

    if (e.button === 2) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.contextMenuPosition = { x, y };
      this.setState({ contextMenuItems: this.props.getContextItems(ContextMenuType.CANVAS) });
      this.contextMenu.handleContainerMouseDown(e, this.contextMenuPosition);
    }
  };

  handleMouseMove = e => {
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

    this.handleNodeToAddChildTo(this.state.nodeToAddChildTo, e);
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

  handleMouseUp = e => {
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
    if (this.movingNode !== null) {
      this.movingNode = null;
      this.setState({ movingNodePlaceholder: null });
    }

    if (this.state.nodeToAddChildTo !== null) {
      this.props.onCancelConnection();
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
      const uuid = v4();
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
    const setRef = (nodeId) => (nodeRef) => {
      this.rectRefs[nodeId] = nodeRef;
    };
    this.rectRefs = {};

    return nodes.map((node) => {
      const rectRef = setRef(node.id);
      const onMouseDown = (e) => this.handleNodeMouseDown(node, e);
      const onDoubleClick = (e) => {
        if (typeof onDoubleClickNode === 'function') {
          onDoubleClickNode(node, e);
        }
      };

      return renderNode(node, { rectRef, onMouseDown, onDoubleClick });
    });
  };

  render() {
    let addingChildArrow = null;
    let movingNodePlaceholder = null;

    if (this.state.addingChildArrow !== null) {
      const { from, to } = this.state.addingChildArrow;

      addingChildArrow = (
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

    if (this.state.movingNodePlaceholder !== null) {
      const { x, y, height, width } = this.state.movingNodePlaceholder;

      movingNodePlaceholder = (
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

    return (
      <div> 
        <svg
          className={styles.canvas}
          onContextMenu={e => e.preventDefault()}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseLeave}
          height={this.props.network.height}
          width={this.props.network.width}
          ref={ref => (this.canvas = ref)}
        >
          <g>  
            <Arrows arrows={this.state.arrows}/>
          </g>
          <g>
            {this.renderNodes()}
          </g>
          <g>
            {addingChildArrow}
          </g>
          <g>
            {movingNodePlaceholder}
          </g>
          <g>
            {this.props.children}
          </g>
        </svg>

        <ContextMenu
            ref={ref => (this.contextMenu = ref)}
            items={this.state.contextMenuItems}
            />
        
        {this.state.newNode}
        {this.props.children}
      </div>
    );
  }
}

/// optional props
// onClickNode,
// onDoubleClickNode,
// onClickArrow,
// onSelectNodes,
// changeNodePosition,

Network.propTypes = {
  network: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  arrows: PropTypes.func.isRequired,
  renderArrow: PropTypes.func.isRequired,
  renderNode: PropTypes.func.isRequired,
  requestCreateNode: PropTypes.func.isRequired,
  onAddConnection: PropTypes.func.isRequired,
  onCancelConnection: PropTypes.func.isRequired,
  onSelectNodes: PropTypes.func.isRequired,
  getContextItems: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func,
};

const mapStateToProps = state => ({
  network: getNetwork(state),
  nodes: getNodesWithPositions(state),
});

// export default connect(mapStateToProps)(Network);
export default Network;
