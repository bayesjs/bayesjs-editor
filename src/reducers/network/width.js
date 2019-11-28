import { CHANGE_NETWORK_PROPERTY, LOAD_NETWORK, NEW_NETWORK } from 'actions';
import { updateNetworkProperty } from 'utils/network';
import { pathOr } from 'ramda';

const defaultValue = 800;
const getNetworkWidth = pathOr(defaultValue, ['payload', 'state', 'network', 'width']);
const updateProperty = updateNetworkProperty('width');

export default (state = defaultValue, action) => {
  switch (action.type) {
    case LOAD_NETWORK:
      return getNetworkWidth(action);
    case NEW_NETWORK:
      return defaultValue;
    case CHANGE_NETWORK_PROPERTY:
      return updateProperty(state, action);
    default:
      return state;
  }
};
