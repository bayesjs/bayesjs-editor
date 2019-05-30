import { Component } from 'react';
import { subtract } from 'ramda';
import PropTypes from 'prop-types';
import { noop, throttle } from 'lodash';
import { elementInstancePropTypes } from 'models';

class SvgMousePosition extends Component {
  state = {
    mousePosition: {},
    // eslint-disable-next-line react/no-unused-state
    svgReact: null,
    hasPosition: false,
  }

  componentDidMount() {
    const { svg, delay } = this.props;

    this.isComponentMounted = true;
    this.updatePositionWithThrottle = throttle(this.updatePosition, delay);
    this.updateSvgElementRect();
    svg.addEventListener('mousemove', this.updatePositionWithThrottle);
  }

  componentWillUnmount() {
    const { svg } = this.props;

    this.isComponentMounted = false;
    svg.removeEventListener('mousemove', this.updatePositionWithThrottle);
  }

  updatePosition = ({ clientX, clientY }) => {
    // eslint-disable-next-line react/prop-types
    const { onFirstMoveOnce } = this.props;

    if (this.isComponentMounted) {
      this.setState(({ svgReact: { top, left } }) => {
        const mousePosition = {
          x: subtract(clientX, left),
          y: subtract(clientY, top),
        };
        onFirstMoveOnce(mousePosition);

        return { mousePosition, hasPosition: true };
      });
    }
  }

  updateSvgElementRect = () => {
    const { svg } = this.props;
    const svgRect = svg.getBoundingClientRect();

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      svgReact: {
        top: svgRect.top,
        left: svgRect.left,
      },
    });
  }

  render() {
    const { mousePosition, hasPosition } = this.state;
    const { children } = this.props;

    return children({ position: mousePosition, hasPosition });
  }
}

SvgMousePosition.propTypes = {
  svg: elementInstancePropTypes.isRequired,
  children: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  onFirstMove: PropTypes.func,
  delay: PropTypes.number,
};

SvgMousePosition.defaultProps = {
  delay: 0,
  onFirstMove: noop,
};

export default SvgMousePosition;
