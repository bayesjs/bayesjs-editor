import {
  UPDATE_NETWORK_HEIGHT,
  LOAD_NETWORK,
  NEW_NETWORK,
} from 'actions';
import { pathOr, path } from 'ramda';

const defaultValue = 500;
const getNetworkHeight = pathOr(defaultValue, ['payload', 'state', 'network', 'height']);
const getHeight = path(['payload', 'height']);

export default (state = defaultValue, action) => {
  switch (action.type) {
    case LOAD_NETWORK:
      return getNetworkHeight(action);
    case NEW_NETWORK:
      return defaultValue;
    case UPDATE_NETWORK_HEIGHT:
      return getHeight(action);
    default:
      return state;
  }
};
