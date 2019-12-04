import { CHANGE_NETWORK_PROPERTY, LOAD_NETWORK, NEW_NETWORK } from 'actions';
import { updateNetworkProperty } from 'utils/network';
import { pathOr } from 'ramda';

const defaultValue = true;
const getNetworkPropertiesPanelVisible = pathOr(defaultValue, ['payload', 'state', 'network', 'propertiesPanelVisible']);
const updateProperty = updateNetworkProperty('propertiesPanelVisible');

export default (state = defaultValue, action) => {
  switch (action.type) {
    case LOAD_NETWORK:
      return getNetworkPropertiesPanelVisible(action);
    case NEW_NETWORK:
      return defaultValue;
    case CHANGE_NETWORK_PROPERTY:
      return updateProperty(state, action);
    default:
      return state;
  }
};
