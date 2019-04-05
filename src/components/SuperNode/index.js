import PropTypes from 'prop-types';
import React from 'react';
import NodeGeneric from '../NodeGeneric';
import { nodePropTypes } from '../../models';

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
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes).isRequired,
};

export default SuperNode;
