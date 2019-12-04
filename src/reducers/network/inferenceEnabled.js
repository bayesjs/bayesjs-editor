import { CHANGE_NETWORK_PROPERTY, LOAD_NETWORK, NEW_NETWORK } from 'actions';
import { updateNetworkProperty } from 'utils/network';
import { pathOr } from 'ramda';

const defaultValue = true;
const getNetworkInfenceEnabled = pathOr(defaultValue, ['payload', 'state', 'network', 'inferenceEnabled']);
const updateProperty = updateNetworkProperty('inferenceEnabled');

export default (state = defaultValue, action) => {
  switch (action.type) {
    case LOAD_NETWORK:
      return getNetworkInfenceEnabled(action);
    case NEW_NETWORK:
      return defaultValue;
    case CHANGE_NETWORK_PROPERTY:
      return updateProperty(state, action);
    default:
      return state;
  }
};
