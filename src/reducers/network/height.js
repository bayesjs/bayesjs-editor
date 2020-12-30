import {
  LOAD_NETWORK,
  NEW_NETWORK,
  UPDATE_NETWORK_HEIGHT,
} from '@actions';
import { path, pathOr } from 'ramda';

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
