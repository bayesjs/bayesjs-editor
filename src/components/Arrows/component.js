import React from 'react';

import PropTypes from 'prop-types';
import { arrowsPropTypes } from 'models';
import Arrow from '../Arrow';
import ArrowsDefs from '../ArrowsDefs';

const Arrows = ({
  arrows,
  keyFocus,
  onMouseOver,
  onMouseLeave,
  getStrokeOpacity,
  getMarkEndStyle,
  onMouseDown,
}) => (
  <g>
    <ArrowsDefs />
    {arrows.map(({
      key, from, to, markEnd, childId, parentId,
    }) => ( // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      <Arrow
        key={key}
        id={key}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        strokeOpacity={getStrokeOpacity(key, keyFocus)}
        markEndStyle={getMarkEndStyle(key, keyFocus)}
        from={from}
        to={to}
        markEnd={markEnd}
        onMouseDown={onMouseDown({ childId, parentId })}
      />
    ))}
  </g>
);

Arrows.propTypes = {
  arrows: arrowsPropTypes.isRequired,
  keyFocus: PropTypes.string.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  getStrokeOpacity: PropTypes.func.isRequired,
  getMarkEndStyle: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
};

export default Arrows;
