import React from 'react';
import Node from 'components/Node';

const Nodes = ({
  nodes,
  onMouseDown,
  onDoubleClick,
  onStateDoubleClick,
}) => nodes.map((node) => {
  const props = {
    ...node,
    onMouseDown: onMouseDown(node),
    onDoubleClick: onDoubleClick(node),
    onStateDoubleClick: onStateDoubleClick(node),
  };

  return <Node key={node.id} {...props} />;
});

export default Nodes;
