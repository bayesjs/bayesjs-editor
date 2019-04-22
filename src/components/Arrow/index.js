import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { getComponentTestId } from 'utils/test-utils';
import { positionPropTypes } from 'models';

class Arrow extends Component {
  makeControlPoint = (point, n = 50) => {
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

  makeLine = (from, to) => {
    const c1 = this.makeControlPoint(from);
    const c2 = this.makeControlPoint(to);

    return `M${from.x},${from.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${to.x},${to.y}`;
  };

  getMarkerEnd = (markEnd, markEndStyle) => {
    if (markEnd === false) return null;

    return markEndStyle || 'url(#triangle)';
  }

  render() {
    const {
      from, to, onMouseDown, markEnd, title, markEndStyle,
    } = this.props;
    const style = { cursor: 'pointer' };
    const d = this.makeLine(from, to);

    return (
      <g data-testid={getComponentTestId('Arrow')}>
        <path
          d={d}
          fill="none"
          stroke="transparent"
          strokeWidth="15"
          style={style}
          onMouseDown={onMouseDown}
        >
          {title}
        </path>
        <path
          d={d}
          fill="none"
          stroke="#333"
          strokeWidth="2"
          markerEnd={this.getMarkerEnd(markEnd, markEndStyle)}
          style={style}
          onMouseDown={onMouseDown}
        >
          {title}
        </path>
      </g>
    );
  }
}

Arrow.defaultProps = {
  markEndStyle: '',
};

Arrow.propTypes = {
  from: PropTypes.objectOf(positionPropTypes).isRequired,
  to: PropTypes.objectOf(positionPropTypes).isRequired,
  onMouseDown: PropTypes.func.isRequired,
  markEnd: PropTypes.bool.isRequired,
  markEndStyle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Arrow;
