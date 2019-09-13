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
import React from 'react';
import ContextMenu from 'components/ContextMenu';
import { CONTEXTMENU_TYPES } from 'constants/contextmenu';

const Node = (props) => {
  const { id, contextItems } = props;

  return (
    <ContextMenu
      renderTag="g"
      id={id}
      type={CONTEXTMENU_TYPES.NODE}
      items={contextItems}
      data={props}
    >
      <GenericNode {...props}>
        <NodeStates {...props} />
        <NodeConnections {...props} />
      </GenericNode>
    </ContextMenu>
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
