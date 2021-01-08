import { changeNodeDescription, changeNodeId } from '@actions';

import { connectify } from '@decorators';
import { getNodes } from '@selectors';
import { onEditingNodeCpt } from '@actions/editing-node-cpt';
import { onEditingNodeStates } from '@actions/editing-node-states';

const enhance = connectify({
  nodes: getNodes,
}, {
  onChangeNodeDescription: ({ id }, description) => changeNodeDescription(id, description),
  onChangeNodeName: ({ id }, name) => changeNodeId(id, name),
  onEditNodeCpt: node => onEditingNodeCpt(node),
  onEditNodeStates: onEditingNodeStates,
});

export default enhance;
