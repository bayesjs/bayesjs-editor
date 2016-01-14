export const INIT_DRAG = 'drag/INIT_DRAG';
export const UPDATE_DRAG_POSITION = 'drag/UPDATE_DRAG_POSITION';
export const END_DRAG = 'drag/END_DRAG';

export const initDrag = (id, x, y) => ({
  type: INIT_DRAG,
  id,
  x,
  y
});

export const updateDragPosition = (x, y) => ({
  type: UPDATE_DRAG_POSITION,
  x,
  y
});

export const endDrag = () => ({
  type: END_DRAG
});
