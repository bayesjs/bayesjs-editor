import {
  positionPropTypes,
  sizePropTypes,
  statePropTypes,
  contextMenuItemPropTypes,
} from 'models';

import GenericNode from 'components/GenericNode';
import NodeConnections from 'components/NodeConnections';
import NodeStates from 'components/NodeStates';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ContextMenuTrigger from 'components/ContextMenuTrigger';
import { CONTEXTMENU_TYPES } from 'constants/contextmenu';
import ContextMenuItems from 'components/ContextMenuItems';

const Node = (props) => {
  const { id, contextItems } = props;

  return (
    <Fragment>
      <ContextMenuTrigger renderTag="g" id={id} type={CONTEXTMENU_TYPES.NODE}>
        <GenericNode {...props}>
          <NodeStates {...props} />
          <NodeConnections {...props} />
        </GenericNode>
      </ContextMenuTrigger>

      <ContextMenuItems
        id={id}
        type={CONTEXTMENU_TYPES.NODE}
        items={contextItems}
        data={props}
      />
    </Fragment>
  );
};

Node.defaultProps = {
  belief: null,
  description: null,
  states: null,
  results: {},
  isSelected: false,
  contextItems: [],
};

Node.propTypes = {
  id: PropTypes.string.isRequired,
  states: PropTypes.arrayOf(statePropTypes),
  results: PropTypes.objectOf(PropTypes.number),
  isSelected: PropTypes.bool,
  belief: PropTypes.string,
  onMouseDown: PropTypes.func.isRequired,
  onStateDoubleClick: PropTypes.func.isRequired,
  position: positionPropTypes.isRequired,
  size: sizePropTypes.isRequired,
  description: PropTypes.string,
  contextItems: PropTypes.arrayOf(contextMenuItemPropTypes),
};

export default Node;
