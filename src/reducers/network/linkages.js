import {
  ADD_LINKAGE,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_LINKAGE,
} from '@actions';
import {
  assoc,
  defaultTo,
  dissoc,
  path,
  pipe,
} from 'ramda';

const getLinkagesFromAction = path(['payload', 'state', 'network', 'linkages']);
const getLinkageFromAction = path(['payload', 'linkage']);
const getIdFromAction = path(['payload', 'id']);
const getLinkagesOrDefaultFromAction = pipe(
  getLinkagesFromAction,
  defaultTo({}),
);

export default (state = {}, action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return {};
    case ADD_LINKAGE: {
      return assoc(Date.now(), getLinkageFromAction(action), state);
    }
    case REMOVE_LINKAGE: {
      return dissoc(getIdFromAction(action), state);
    }
    case LOAD_NETWORK:
      return getLinkagesOrDefaultFromAction(action);
    default:
      return state;
  }
};
