export const MOVE_NODE = 'nodes/MOVE_NODE';

export const moveNode = (id, differenceLeft, differenceTop) => ({
  type: MOVE_NODE,
  id,
  differenceLeft,
  differenceTop
});
