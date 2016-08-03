export const CHANGE_NODE_POSITION = 'CHANGE_NODE_POSITION';

export const changeNodePosition = (id, x, y) => ({
  type: CHANGE_NODE_POSITION,
  payload: { id, x, y },
});
