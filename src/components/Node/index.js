import React, { Component, PropTypes } from 'react';
import styles from './styles.css';

class Node extends Component {
  renderState = (state, index) => {
    let result;

    if (this.props.belief != null) {
      result = this.props.belief === state ? 1 : 0;
    } else {
      result = this.props.results[state];
    }

    const percent = 100 * result;
    const barWidth = 70 * result;
    const fillColor = this.props.belief != null ? '#EE4040' : '#4040EE';

    return (
      <g key={state}>
        <text x="5" y={37 + (18 * index)}>
          {state}
        </text>
        <rect
          x={155 - barWidth}
          y={24 + (18 * index)}
          height="15"
          width={barWidth}
          fill={fillColor}
        />
        <rect
          x="85"
          y={24 + (18 * index)}
          height="15"
          width="70"
          fill="transparent"
          stroke="#333"
          strokeWidth="1"
          onDoubleClick={() => this.props.onStateDoubleClick(state)}
        >
          <title>{percent.toFixed(2)}%</title>
        </rect>
      </g>
    );
  };

  render() {
    return (
      <g
        className={styles.node}
        onMouseDown={this.props.onMouseDown}
        transform={`translate(${this.props.x} ${this.props.y})`}
      >
        <rect
          height={25 + (18 * this.props.states.length)}
          width="160"
          fill="#ff8"
          stroke="#333"
          strokeWidth={this.props.selected ? 3 : 1}
          ref={this.props.rectRef}
        />

        <text x="5" y="15">{this.props.id}</text>
        <path d="M0,20 h160" stroke="#333" />

        {this.props.states.map(this.renderState)}
      </g>
    );
  }
}

Node.propTypes = {
  id: PropTypes.string.isRequired,
  states: PropTypes.arrayOf(PropTypes.string).isRequired,
  results: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  belief: PropTypes.string,
  rectRef: PropTypes.func,
  onMouseDown: PropTypes.func.isRequired,
  onStateDoubleClick: PropTypes.func.isRequired,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Node;
