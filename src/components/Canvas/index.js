import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ContextMenu from '../ContextMenu';
import AddNodeModal from '../AddNodeModal';
import Node from '../Node';
import styles from './styles.css';

import {
  persistState,
  addParent,
  removeNode,
  changeNetworkProperty,
  changeNodePosition,
} from '../../actions';

import {
  getNetwork,
  getNodes,
  getInferenceResults,
} from '../../selectors';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arrows: [],
      contextMenuItems: [],
      newNodePosition: null,
      addingNodeArrow: null,
    };

    this.rectRefs = {};
    this.movingNode = null;
    this.nodeToAddChildrenTo = null;

    this.canvasContextMenuItems = [
      {
        key: 'add-node',
        text: 'Adicionar variável',
        onClick: () => this.setState({ newNodePosition: this.contextMenuPosition }),
      },
    ];

    this.nodeContextMenuItems = [
      {
        key: 'add-children',
        text: 'Adicionar filho',
        onClick: () => (this.nodeToAddChildrenTo = this.contextMenuNode),
      },
      {
        key: 'remove-node',
        text: 'Remover variável',
        onClick: () => {
          this.props.dispatch(removeNode(this.contextMenuNode.id));
          setTimeout(() => this.calculateArrows(), 0);
        },
      },
    ];
  }

  componentDidMount() {
    this.calculateArrows();
  }

  calculateArrows = () => {
    const getNodeLinksPositions = node => {
      const { height, width } = this.rectRefs[node.id].getBoundingClientRect();

      const top = {
        x: node.position.x + width / 2,
        y: node.position.y,
        type: 'top',
      };

      const right = {
        x: node.position.x + width,
        y: node.position.y + height / 2,
        type: 'right',
      };

      const bottom = {
        x: node.position.x + width / 2,
        y: node.position.y + height,
        type: 'bottom',
      };

      const left = {
        x: node.position.x,
        y: node.position.y + height / 2,
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

    const { nodes } = this.props;
    const arrows = [];

    nodes.forEach(node => {
      node.parents.forEach(parentId => {
        const parent = nodes.find(x => x.id === parentId);
        const points = getNearestPoints(parent, node);

        arrows.push({
          key: `${parentId}-${node.id}`,
          from: points.p1,
          to: points.p2,
        });
      });
    });

    this.setState({ arrows });
  };

  handleNodeMouseDown = (node, e) => {
    e.stopPropagation();

    this.props.dispatch(changeNetworkProperty('selectedNodes', [node.id]));

    if (e.button === 0) {
      if (this.nodeToAddChildrenTo !== null) {
        this.props.dispatch(addParent(node.id, this.nodeToAddChildrenTo.id));
        this.nodeToAddChildrenTo = null;
        this.setState({ addingNodeArrow: null });
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
      this.setState({ contextMenuItems: this.nodeContextMenuItems });
      this.contextMenu.handleContainerMouseDown(e);
    }
  };

  handleMouseDown = e => {
    // Use setTimeout to ensure that the blur event of inputs in the properties panel is fired.
    setTimeout(() => {
      this.props.dispatch(changeNetworkProperty('selectedNodes', []));
    }, 0);

    if (this.nodeToAddChildrenTo !== null) {
      this.nodeToAddChildrenTo = null;
      this.setState({ addingNodeArrow: null });
    }

    if (e.button === 2) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.contextMenuPosition = { x, y };
      this.setState({ contextMenuItems: this.canvasContextMenuItems });
      this.contextMenu.handleContainerMouseDown(e);
    }
  };

  handleMouseMove = e => {
    if (this.movingNode !== null) {
      const { id, initialPosition, initialMousePosition } = this.movingNode;

      const difX = e.clientX - initialMousePosition.x;
      const difY = e.clientY - initialMousePosition.y;

      const newX = initialPosition.x + difX;
      const newY = initialPosition.y + difY;

      this.props.dispatch(changeNodePosition(id, newX, newY));

      this.calculateArrows();
    }

    if (this.nodeToAddChildrenTo !== null) {
      const canvasRect = this.canvas.getBoundingClientRect();
      const nodeRect = this.rectRefs[this.nodeToAddChildrenTo.id].getBoundingClientRect();

      const from = {
        x: nodeRect.left + (nodeRect.width / 2) - canvasRect.left,
        y: nodeRect.top + (nodeRect.height / 2) - canvasRect.top,
      };

      const to = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      };

      this.setState({
        addingNodeArrow: { from, to },
      });
    }
  };

  handleMouseUp = () => {
    if (this.movingNode !== null) {
      this.movingNode = null;
      this.props.dispatch(persistState());
    }
  };

  handleMouseLeave = () => {
    if (this.movingNode !== null) {
      this.movingNode = null;
      this.props.dispatch(persistState());
    }

    if (this.nodeToAddChildrenTo !== null) {
      this.nodeToAddChildrenTo = null;
      this.setState({ addingNodeArrow: null });
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
    </defs>
  );

  renderArrow = arrow => {
    const makeControlPoint = (point, n = 50) => {
      const control = { ...point };

      if (control.type === 'top') {
        control.y -= n;
      } else if (control.type === 'bottom') {
        control.y += n;
      } else if (control.type === 'left') {
        control.x -= n;
      } else if (control.type === 'right') {
        control.x += n;
      }

      return control;
    };

    const makeLine = (from, to) => {
      const c1 = makeControlPoint(from);
      const c2 = makeControlPoint(to);

      return `M${from.x},${from.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${to.x},${to.y}`;
    };

    return (
      <path
        key={arrow.key}
        d={makeLine(arrow.from, arrow.to)}
        fill="none"
        stroke="#333"
        strokeWidth="2"
        markerEnd="url(#triangle)"
      />
    );
  };

  renderNode = node => (
    <Node
      key={node.id}
      id={node.id}
      states={node.states}
      results={this.props.inferenceResults[node.id]}
      selected={this.props.network.selectedNodes.some(x => x === node.id)}
      rectRef={ref => {
        this.rectRefs[node.id] = ref;
      }}
      onMouseDown={e => this.handleNodeMouseDown(node, e)}
      x={node.position.x}
      y={node.position.y}
    />
  );

  render() {
    let addingNodeArrow = null;

    if (this.state.addingNodeArrow != null) {
      const { from, to } = this.state.addingNodeArrow;

      addingNodeArrow = (
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

    return (
      <div className={styles.scroll}>
        <div className={styles.container}>
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
            {this.renderDefs()}
            {this.state.arrows.map(this.renderArrow)}
            {this.props.nodes.map(this.renderNode)}
            {addingNodeArrow}
          </svg>

          <ContextMenu
            ref={ref => (this.contextMenu = ref)}
            items={this.state.contextMenuItems}
          />

          <AddNodeModal
            position={this.state.newNodePosition}
            onRequestClose={() => this.setState({ newNodePosition: null })}
          />
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  dispatch: PropTypes.func.isRequired,
  network: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  inferenceResults: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  network: getNetwork(state),
  nodes: getNodes(state),
  inferenceResults: getInferenceResults(state),
});

export default connect(mapStateToProps, null, null, { withRef: true })(Canvas);
