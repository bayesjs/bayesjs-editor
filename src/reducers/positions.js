import {
  NEW_NETWORK,
  LOAD_NETWORK,
  ADD_NODE,
  REMOVE_NODE,
  CHANGE_NODE_ID,
  CHANGE_NODE_POSITION,
  ADD_SUPER_NODE,
} from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return {};
    case LOAD_NETWORK:
      return action.payload.state.positions;
    case ADD_NODE:
    case ADD_SUPER_NODE:
      return {
        ...state,
        [action.payload.id]: action.payload.position,
      };
    case REMOVE_NODE:
      {
        const newState = { ...state };
        delete newState[action.payload.id];
        return newState;
      }
    case CHANGE_NODE_ID:
      {
        const newState = { ...state };
        delete newState[action.payload.id];
        newState[action.payload.nextId] = state[action.payload.id];
        return newState;
      }
    case CHANGE_NODE_POSITION:
      {
        const newPosition = {
          x: action.payload.x,
          y: action.payload.y,
        };

        return {
          ...state,
          [action.payload.id]: newPosition,
        };
      }
    default:
      return state;
  }
};
