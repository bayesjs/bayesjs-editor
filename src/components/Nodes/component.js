import React from 'react';
import Node from 'components/Node';

const Nodes = ({
  nodes,
  onMouseDown,
  onDoubleClick,
  onStateDoubleClick,
  contextItems,
}) => nodes.map((node) => {
  const props = {
    ...node,
    onMouseDown: onMouseDown(node),
    onDoubleClick: onDoubleClick(node),
    onStateDoubleClick: onStateDoubleClick(node),
  };

  return <Node key={node.id} contextItems={contextItems} {...props} />;
});

export default Nodes;
