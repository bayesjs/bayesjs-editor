import {
  INIT_DRAG,
  UPDATE_DRAG_POSITION,
  END_DRAG
} from '../actions/drag';

const initialState = {
  draggingNodeId: null,
  initialPosition: { x: 0, y: 0 },
  differenceFromInitialPosition: { x: 0, y: 0 }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_DRAG:
      return {
        ...state,
        draggingNodeId: action.id,
        initialPosition: { x: action.x, y: action.y }
      };
    case UPDATE_DRAG_POSITION:
      return {
        ...state,
        differenceFromInitialPosition: {
          x: action.x - state.initialPosition.x,
          y: action.y - state.initialPosition.y
        }
      };
    case END_DRAG:
      return {
        ...state,
        draggingNodeId: null,
        differenceFromInitialPosition: { x: 0, y: 0 }
      };
    default:
      return state;
  }
};
