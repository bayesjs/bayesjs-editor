import React, { Component } from 'react';
import { elementInstancePropTypes, networkPropTypes, nodePropTypes } from 'models';

import NodePlaceholder from 'components/NodePlaceholder';
import PropTypes from 'prop-types';
import SvgMousePosition from 'components/SvgMousePosition';
import { subtractPositions } from 'utils/position';

class NodeMovingPlaceholder extends Component {
  componentDidMount() {
    const { svg } = this.props;

    svg.addEventListener('mouseup', this.handleSetPosition);
    svg.addEventListener('mouseleave', this.handleCancel);
  }

  componentWillUnmount() {
    const { svg } = this.props;

    svg.removeEventListener('mouseup', this.handleSetPosition);
    svg.removeEventListener('mouseleave', this.handleCancel);
  }

  handleSetPosition = () => {
    const { onSetPosition } = this.props;

    if (this.lastNodePosition) {
      onSetPosition(this.lastNodePosition);
    } else {
      this.handleCancel();
    }
  }

  handleCancel = () => {
    const { onCancel } = this.props;

    onCancel();
  }

  setMousePositionInNode = (svgMousePosition) => {
    const { node: { position } } = this.props;

    this.mousePositionInNode = subtractPositions(svgMousePosition, position);
  }

  render() {
    const { svg, node: { size } } = this.props;

    return (
      <SvgMousePosition svg={svg} onFirstMove={this.setMousePositionInNode} delay={25}>
        {({ position }) => {
          if (!this.mousePositionInNode) return null;
          const nodePosition = subtractPositions(position, this.mousePositionInNode);
          this.lastNodePosition = nodePosition;

          return (
            <NodePlaceholder
              {...nodePosition}
              {...size}
            />
          );
        }}
      </SvgMousePosition>
    );
  }
}

NodeMovingPlaceholder.propTypes = {
  node: PropTypes.oneOfType([nodePropTypes, networkPropTypes]).isRequired,
  svg: elementInstancePropTypes.isRequired,
  onSetPosition: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default NodeMovingPlaceholder;
