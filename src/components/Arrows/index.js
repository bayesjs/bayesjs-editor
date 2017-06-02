import React, { Component, PropTypes } from 'react';

class Arrows extends Component {
  constructor(props) {
    super(props);

    this.state = {
      indexFocus: null,
    };
  }

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
        id="triangle-opacity"
        viewBox="0 0 10 10"
        markerWidth="6"
        markerHeight="6"
        refX="8"
        refY="5"
        orient="auto"
        opacity="0.2"
      >
        <path d="M0,0 L10,5 L0,10" fill="#333" />
      </marker>
    </defs>
  );

  bringArrowToFront = (uuid) => () => {
    const { arrowsRendered } = this.state;
    const sorted = arrowsRendered.sort((a, b) => {
      if (a.key === uuid) return 1;
      else if (b.key === uuid) return -1;
      return 0;
    });
    
    this.setState({ 
      arrowsRendered: sorted
    });
  };
  
  onMouseOver = (index) => (e) => {
    this.setState({
      indexFocus: index,
    })
  };

  onMouseLeave = (index) => (e) => {
    this.setState({
      indexFocus: null,
    })
  };

  getStrokeOpacity = (index, indexFocus) => {
    if (indexFocus != null) {
      if (index != indexFocus) return 0.2;
    }

    return 1;
  };

  getArrow = (arrow, index, indexFocus) => {
    const value = this.getStrokeOpacity(index, indexFocus);
    
    return React.cloneElement(
      arrow, 
      { markEndStyle: value === 1 ? 'url(#triangle)' : 'url(#triangle-opacity)' }
    );
  }

  render() {
    const { arrows } = this.props;
    const { fillOpacity, indexFocus } = this.state;

    return (
      <g>
        {this.renderDefs()}
        {arrows.map((arrow, i) => (
          <g key={i}
            onMouseOver={this.onMouseOver(i)}
            onMouseLeave={this.onMouseLeave(i)}
            strokeOpacity={this.getStrokeOpacity(i, indexFocus)}
            style={{
              transition: 'stroke-opacity 0.2s'
            }}
            >
              {this.getArrow(arrow, i, indexFocus)}
          </g>
        ))}
      </g>
    );
  }
}

Arrows.propTypes = {
  arrows: PropTypes.array.isRequired,
};

export default Arrows;