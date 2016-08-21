import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNetworkProperty, changeNodePosition } from '../../actions';
import { getNetwork, getNodes, getInferenceResults } from '../../selectors';
import Node from '../Node';
import styles from './styles.css';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arrows: [],
    };

    this.movingNode = null;
    this.rectRefs = {};
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

    this.props.dispatch(changeNetworkProperty('selectedNodes', [node.id]));
  };

  handleMouseDown = () => {
    // Use setTimeout to ensure that the blur event of inputs in the properties panel is fired.
    setTimeout(() => {
      this.props.dispatch(changeNetworkProperty('selectedNodes', []));
    }, 0);
  };

  handleMouseMove = e => {
    if (this.movingNode == null) {
      return;
    }

    const { id, initialPosition, initialMousePosition } = this.movingNode;

    const difX = e.clientX - initialMousePosition.x;
    const difY = e.clientY - initialMousePosition.y;

    const newX = initialPosition.x + difX;
    const newY = initialPosition.y + difY;

    this.props.dispatch(changeNodePosition(id, newX, newY));

    this.calculateArrows();
  };

  handleMouseUpOrLeave = () => {
    this.movingNode = null;
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
    return (
      <div className={styles.scroll}>
        <div className={styles.container}>
          <svg
            className={styles.canvas}
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUpOrLeave}
            onMouseLeave={this.handleMouseUpOrLeave}
            height={this.props.network.height}
            width={this.props.network.width}
          >
            {this.renderDefs()}
            {this.state.arrows.map(this.renderArrow)}
            {this.props.nodes.map(this.renderNode)}
          </svg>
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
