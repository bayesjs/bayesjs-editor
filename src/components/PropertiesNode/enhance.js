import { changeNodeDescription, changeNodeId } from 'actions';

import { getNodes } from 'selectors';
import { connectify } from 'decorators';
import { onEditingNodeCpt } from 'actions/editing-node-cpt';

const enhance = connectify({
  nodes: getNodes,
}, {
  onChangeNodeDescription: ({ id }, description) => changeNodeDescription(id, description),
  onChangeNodeName: ({ id }, name) => changeNodeId(id, name),
  onEditNodeCpt: node => onEditingNodeCpt(node),
});

export default enhance;
