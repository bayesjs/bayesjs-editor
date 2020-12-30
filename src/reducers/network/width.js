import {
  LOAD_NETWORK,
  NEW_NETWORK,
  UPDATE_NETWORK_WIDTH,
} from '@actions';
import { path, pathOr } from 'ramda';

const defaultValue = 800;
const getNetworkWidth = pathOr(defaultValue, ['payload', 'state', 'network', 'width']);
const getWidth = path(['payload', 'width']);

export default (state = defaultValue, action) => {
  switch (action.type) {
    case LOAD_NETWORK:
      return getNetworkWidth(action);
    case NEW_NETWORK:
      return defaultValue;
    case UPDATE_NETWORK_WIDTH:
      return getWidth(action);
    default:
      return state;
  }
};
