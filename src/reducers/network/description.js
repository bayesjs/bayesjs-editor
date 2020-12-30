import {
  LOAD_NETWORK,
  NEW_NETWORK,
  UPDATE_NETWORK_DESCRIPTION,
} from '@actions';
import { path, pathOr } from 'ramda';

const defaultValue = '';
const getNetworkDescription = pathOr(defaultValue, ['payload', 'state', 'network', 'description']);
const getDescription = path(['payload', 'description']);

export default (state = defaultValue, action) => {
  switch (action.type) {
    case LOAD_NETWORK:
      return getNetworkDescription(action);
    case NEW_NETWORK:
      return defaultValue;
    case UPDATE_NETWORK_DESCRIPTION:
      return getDescription(action);
    default:
      return state;
  }
};
