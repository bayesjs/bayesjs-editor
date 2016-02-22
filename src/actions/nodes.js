export const SELECT_NODE = 'nodes/SELECT_NODE';
export const MOVE_NODE = 'nodes/MOVE_NODE';

export const selectNode = id => ({
  type: SELECT_NODE,
  id
});

export const moveNode = (id, differenceLeft, differenceTop) => ({
  type: MOVE_NODE,
  id,
  differenceLeft,
  differenceTop
});
