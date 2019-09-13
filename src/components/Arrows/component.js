import Arrow from 'components/Arrow';
import ArrowsDefs from 'components/ArrowsDefs';
import PropTypes from 'prop-types';
import React from 'react';
import { arrowPropTypes, contextMenuItemPropTypes } from 'models';

const Arrows = ({
  arrows,
  keyFocus,
  onMouseOver,
  onMouseLeave,
  getStrokeOpacity,
  getMarkEndStyle,
  contextItems,
}) => (
  <g>
    <ArrowsDefs />
    {arrows.map(({ key, ...arrowProps }) => (
      <Arrow
        key={key}
        id={key}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        strokeOpacity={getStrokeOpacity(key, keyFocus)}
        markEndStyle={getMarkEndStyle(key, keyFocus)}
        contextItems={contextItems}
        {...arrowProps}
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
  contextItems: PropTypes.arrayOf(contextMenuItemPropTypes),
};

Arrows.defaultProps = {
  keyFocus: null,
  contextItems: [],
};

export default Arrows;
