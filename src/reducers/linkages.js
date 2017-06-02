import {
  NEW_NETWORK,
  LOAD_NETWORK,
  REMOVE_NODE,
  ADD_LINKAGE,
  REMOVE_LINKAGE,
} from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return {};
    case ADD_LINKAGE:
      return {
        ...state,
        [Date.now()]: action.payload.linkage
      }
    case REMOVE_LINKAGE:
      const { id } = action.payload;
      const newState = { ...state };
      delete newState[id];

      return newState;
    case LOAD_NETWORK:
      const { linkages } = action.payload.state.network;
      return linkages || {};
    default: 
      return state;
  }
}