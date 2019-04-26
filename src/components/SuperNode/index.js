import PropTypes from 'prop-types';
import React from 'react';
import { nodePropTypes } from 'models';
import NodeGeneric from '../NodeGeneric';

const SuperNode = (props) => {
  const { nodes } = props;
  const title = `${nodes.length} nodo${nodes.length === 1 ? '' : 's'}`;

  return (
    <NodeGeneric
      {...props}
    >
      <foreignObject x="5" y="21" height="15" width="75">
        <p
          title={title}
          style={{
            margin: 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </p>
      </foreignObject>
    </NodeGeneric>
  );
};

SuperNode.propTypes = {
  id: PropTypes.string.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes).isRequired,
};

export default SuperNode;
