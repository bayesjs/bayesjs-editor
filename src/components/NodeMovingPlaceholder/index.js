import { networkPropTypes, nodePropTypes, elementInstancePropTypes } from 'models';

import NodePlaceholder from 'components/NodePlaceholder';
import SvgMousePosition from 'components/SvgMousePosition';
import PropTypes from 'prop-types';
import { subtractPositions } from 'utils/position';
import React, { Component } from 'react';

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
    const { svg } = this.props;

    return (
      <SvgMousePosition svg={svg} onFirstMove={this.setMousePositionInNode} delay={25}>
        {({ position }) => {
          const { node: { size } } = this.props;
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
