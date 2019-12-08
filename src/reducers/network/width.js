import {
  UPDATE_NETWORK_WIDTH,
  LOAD_NETWORK,
  NEW_NETWORK,
} from 'actions';
import { pathOr, path } from 'ramda';

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
