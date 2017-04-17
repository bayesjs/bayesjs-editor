import {
  NEW_NETWORK,
  ADD_ARROW,
  ADD_ARROWS,
  REMOVE_ARROW,
  REMOVE_ALL_ARROWS,
} from '../actions';

export default (state = [], action) => {
  switch (action.type) {
    case NEW_NETWORK:
    case REMOVE_ALL_ARROWS:
      return [];
    case ADD_ARROW:
      return [
        ...state,
        action.arrow
      ];
    case REMOVE_ARROW:
      return [
        ...state
      ];
    default:
      return state;
  }
};
