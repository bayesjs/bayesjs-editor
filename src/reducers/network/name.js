import {
  UPDATE_NETWORK_NAME,
  LOAD_NETWORK,
  NEW_NETWORK,
} from 'actions';
import { pathOr, path } from 'ramda';

const defaultValue = 'Rede Bayesiana';
const getNetworkName = pathOr(defaultValue, ['payload', 'state', 'network', 'name']);
const getName = path(['payload', 'name']);

export default (state = defaultValue, action) => {
  switch (action.type) {
    case LOAD_NETWORK:
      return getNetworkName(action);
    case NEW_NETWORK:
      return defaultValue;
    case UPDATE_NETWORK_NAME:
      return getName(action);
    default:
      return state;
  }
};
