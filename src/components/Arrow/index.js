import React, { PropTypes } from 'react';

const Arrow = ({
  from,
  to,
  onMouseDown,
  markEnd,
}) => {
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

  const makeLine = () => {
    const c1 = makeControlPoint(from);
    const c2 = makeControlPoint(to);

    return `M${from.x},${from.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${to.x},${to.y}`;
  };
  
  const d = makeLine();
  const style = { cursor: 'pointer' };
  
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth="15"
        style={style}
        onMouseDown={onMouseDown}
      />
      <path
        d={d}
        fill="none"
        stroke="#333"
        strokeWidth="2"
        markerEnd={markEnd ? "url(#triangle)" : null}
        style={style}
        onMouseDown={onMouseDown}
      />
    </g>
  )
};

Arrow.prototype = {
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  markEnd: PropTypes.bool.isRequired
}

export default Arrow;