import {
  addParent,
  changeNodePosition,
  removeNode,
  removeParent,
  setBelief,
} from 'actions';
import { onUpdateNetworkSelectedNodes } from 'actions/network';
import {
  getInferenceResults,
  getNetwork,
  getNodesWithPositionsAndSizes,
} from 'selectors';
import { connectify } from 'decorators';
import { onEditingNodeCpt } from 'actions/editing-node-cpt';
import { onEditingNodeStates } from 'actions/editing-node-states';

const enhance = connectify({
  network: getNetwork,
  nodes: getNodesWithPositionsAndSizes,
  inferenceResults: getInferenceResults,
}, {
  onRemoveNodeConnection: ({ childId, parentId }) => removeParent(childId, parentId),
  onChangeSelectedNodes: nodes => onUpdateNetworkSelectedNodes(nodes),
  onRemoveNode: ({ id }) => removeNode(id),
  onConnectNodes: (idFrom, idTo) => addParent(idFrom, idTo),
  onResetNodeBelief: ({ id }) => setBelief(id, null),
  onSetNodeBelief: ({ id }, state) => setBelief(id, state),
  onChangeNodePosition: (nodeId, x, y) => changeNodePosition(nodeId, x, y),
  onEditNodeCpt: node => onEditingNodeCpt(node),
  onEditNodeStates: onEditingNodeStates,
}, null, { forwardRef: true });

export default enhance;
