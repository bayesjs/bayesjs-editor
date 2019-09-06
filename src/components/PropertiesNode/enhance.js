import { changeNodeDescription, changeNodeId } from 'actions';

import { getNodes } from 'selectors';
import { connectify } from 'decorators/';

const enhance = connectify({
  nodes: getNodes,
}, {
  onChangeNodeDescription: ({ id }, description) => changeNodeDescription(id, description),
  onChangeNodeName: ({ id }, name) => changeNodeId(id, name),
});

export default enhance;
