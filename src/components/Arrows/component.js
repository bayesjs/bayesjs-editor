import Arrow from 'components/Arrow';
import ArrowsDefs from 'components/ArrowsDefs';
import PropTypes from 'prop-types';
import React from 'react';
import { arrowPropTypes } from 'models';

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
      key, from, to, markEnd, childId, parentId, ...props
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
        onMouseDown={onMouseDown({
          key, from, to, markEnd, childId, parentId, ...props,
        })}
      />
    ))}
  </g>
);

Arrows.propTypes = {
  arrows: PropTypes.arrayOf(arrowPropTypes).isRequired,
  keyFocus: PropTypes.string,
  onMouseOver: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  getStrokeOpacity: PropTypes.func.isRequired,
  getMarkEndStyle: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
};

Arrows.defaultProps = {
  keyFocus: null,
};

export default Arrows;
