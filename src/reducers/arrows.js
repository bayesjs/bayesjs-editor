import {
  NEW_NETWORK,
} from '@actions';

export default (state = [], action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return [];
    default:
      return state;
  }
};
