import { LOAD_NETWORK, NEW_NETWORK, CHANGE_NETWORK_PROPERTY } from 'actions';
import { updateNetworkProperty } from 'utils/network';
import { pathOr } from 'ramda';

const defaultValue = 'Rede Bayesiana';
const getNetworkName = pathOr(defaultValue, ['payload', 'state', 'network', 'name']);
const updateProperty = updateNetworkProperty('name');

export default (state = defaultValue, action) => {
  switch (action.type) {
    case LOAD_NETWORK:
      return getNetworkName(action);
    case NEW_NETWORK:
      return defaultValue;
    case CHANGE_NETWORK_PROPERTY:
      return updateProperty(state, action);
    default:
      return state;
  }
};
