import {
  ADD_LINKAGE,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_LINKAGE,
} from 'actions';

import { dissoc, path, assoc } from 'ramda';

const getLinkagesFromAction = action =>
  path(['payload', 'state', 'network', 'linkages'], action);

export default (state = {}, action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return {};
    case ADD_LINKAGE: {
      const { linkage } = action.payload;
      return assoc(Date.now(), linkage, state);
    }
    case REMOVE_LINKAGE: {
      const { id } = action.payload;
      return dissoc(id, state);
    }
    case LOAD_NETWORK:
      return getLinkagesFromAction(action) || {};
    default:
      return state;
  }
};
