export const CHANGE_NETWORK_PROPERTY = 'CHANGE_NETWORK_PROPERTY';
export const CHANGE_NODE_ID = 'CHANGE_NODE_ID';
export const CHANGE_NODE_POSITION = 'CHANGE_NODE_POSITION';

export const changeNetworkProperty = (name, value) => ({
  type: CHANGE_NETWORK_PROPERTY,
  payload: { name, value },
});

export const changeNodeId = (id, nextId) => ({
  type: CHANGE_NODE_ID,
  payload: { id, nextId },
});

export const changeNodePosition = (id, x, y) => ({
  type: CHANGE_NODE_POSITION,
  payload: { id, x, y },
});
