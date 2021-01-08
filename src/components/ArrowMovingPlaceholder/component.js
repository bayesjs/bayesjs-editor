import React, { PureComponent } from 'react';
import {
  elementInstancePropTypes,
  nodePropTypes,
  positionPropTypes,
  subnetworkPropTypes,
} from '@models';
import { inRange, noop } from 'lodash';

import ArrowPlaceholder from '@components/ArrowPlaceholder';
import PropTypes from 'prop-types';
import SvgMousePosition from '@components/SvgMousePosition';

const isBetweenCreator = value => (min, max) => inRange(value, min, max);

class ArrowMovingPlaceholder extends PureComponent {
  componentDidMount() {
    const { svg } = this.props;

    svg.addEventListener('mousedown', this.handleSetPosition);
  }

  componentWillUnmount() {
    const { svg } = this.props;

    svg.removeEventListener('mousedown', this.handleSetPosition);
  }

  handleSetPosition = () => {
    const { onSetPosition, nodes } = this.props;

    if (this.lastPosition) {
      onSetPosition({
        position: this.lastPosition,
        node: this.getNodeFromPosition(nodes, this.lastPosition),
      });
    }
  }

  getNodeFromPosition = (nodes, { x, y }) => {
    const isBetweenX = isBetweenCreator(x);
    const isBetweenY = isBetweenCreator(y);

    return nodes.find(({ size, position }) => {
      const isNodeXPosition = isBetweenX(position.x, position.x + size.width);
      const isNodeYPosition = isBetweenY(position.y, position.y + size.height);

      return isNodeXPosition && isNodeYPosition;
    });
  };

  render() {
    const { svg } = this.props;

    return (
      <SvgMousePosition svg={svg} delay={25}>
        {({ position, hasPosition }) => {
          if (!hasPosition) return null;
          const { fromPosition } = this.props;

          this.lastPosition = position;
          return <ArrowPlaceholder from={fromPosition} to={position} />;
        }}
      </SvgMousePosition>
    );
  }
}

ArrowMovingPlaceholder.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.oneOfType([nodePropTypes, subnetworkPropTypes])).isRequired,
  svg: elementInstancePropTypes.isRequired,
  onSetPosition: PropTypes.func,
  fromPosition: positionPropTypes.isRequired,
};

ArrowMovingPlaceholder.defaultProps = {
  onSetPosition: noop,
};

export default ArrowMovingPlaceholder;
