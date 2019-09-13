import {
  addParent,
  changeNetworkProperty,
  changeNodePosition,
  removeNode,
  removeParent,
  setBelief,
} from 'actions';
import {
  getInferenceResults,
  getNetwork,
  getNodesWithPositionsAndSizes,
} from 'selectors';
import { connectify } from 'decorators';

const enhance = connectify({
  network: getNetwork,
  nodes: getNodesWithPositionsAndSizes,
  inferenceResults: getInferenceResults,
}, {
  onRemoveNodeConnection: ({ childId, parentId }) => removeParent(childId, parentId),
  onChangeSelectedNodes: nodes => changeNetworkProperty('selectedNodes', nodes),
  onRemoveNode: ({ id }) => removeNode(id),
  onConnectNodes: (idFrom, idTo) => addParent(idFrom, idTo),
  onResetNodeBelief: ({ id }) => setBelief(id, null),
  onSetNodeBelief: ({ id }, state) => setBelief(id, state),
  onChangeNodePosition: (nodeId, x, y) => changeNodePosition(nodeId, x, y),
}, null, { forwardRef: true });

export default enhance;
