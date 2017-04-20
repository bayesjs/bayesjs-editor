import {
  NEW_NETWORK,
  LOAD_NETWORK,
  REMOVE_NODE,
  ADD_LINKAGE,
  REMOVE_LINKAGE,
} from '../actions';

export default (state = [], action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return [];
    case ADD_LINKAGE:
      return [
        ...state,
        action.payload.linkage,
      ];
    case REMOVE_LINKAGE:
      const { index } = action.payload;

      return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
      ];
    default: 
      return state;
  }
}