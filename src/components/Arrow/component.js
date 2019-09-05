import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { getComponentTestId } from 'utils/test-utils';
import { noop } from 'lodash';
import { omit } from 'ramda';
import { positionPropTypes, contextMenuItemPropTypes } from 'models';
import ContextMenuTrigger from 'components/ContextMenuTrigger';
import { CONTEXTMENU_TYPES } from 'constants/contextmenu';
import ContextMenuItems from 'components/ContextMenuItems';

const style = {
  transition: 'stroke-opacity 0.2s',
};
const stylePath = { cursor: 'pointer' };
const omitProps = omit([
  'markEnd',
  'markEndStyle',
  'contextItems',
  'pathD',
  'parentId',
  'childId',
  'networkId1',
  'networkId2',
  'linkagesIds',
]);

const Arrow = (props) => {
  const {
    id,
    title,
    markerEnd,
    pathD,
    onMouseOver,
    onMouseLeave,
    contextItems,
  } = props;

  return (
    <Fragment>
      <ContextMenuTrigger renderTag="g" id={id} type={CONTEXTMENU_TYPES.ARROW}>
        <g
          style={style}
          onMouseOver={onMouseOver}
          onFocus={onMouseOver}
          onMouseLeave={onMouseLeave}
          onBlur={onMouseLeave}
          data-testid={getComponentTestId('Arrow')}
          {...omitProps(props)}
        >
          <path
            d={pathD}
            fill="none"
            stroke="#333"
            strokeWidth="2"
            markerEnd={markerEnd}
            style={stylePath}
          >
            {title}
          </path>
        </g>
      </ContextMenuTrigger>

      <ContextMenuItems
        id={id}
        type={CONTEXTMENU_TYPES.ARROW}
        items={contextItems}
        data={props}
      />
    </Fragment>
  );
};

Arrow.defaultProps = {
  markEndStyle: '',
  onMouseOver: noop,
  onMouseLeave: noop,
  title: null,
  contextItems: [],
};

Arrow.propTypes = {
  id: PropTypes.string.isRequired,
  from: positionPropTypes.isRequired,
  to: positionPropTypes.isRequired,
  markEnd: PropTypes.bool.isRequired,
  markEndStyle: PropTypes.string,
  markerEnd: PropTypes.string.isRequired,
  title: PropTypes.string,
  onMouseOver: PropTypes.func,
  onMouseLeave: PropTypes.func,
  pathD: PropTypes.string.isRequired,
  contextItems: PropTypes.arrayOf(contextMenuItemPropTypes),
};

export default Arrow;
