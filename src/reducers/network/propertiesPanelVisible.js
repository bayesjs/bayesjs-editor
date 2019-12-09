import {
  UPDATE_NETWORK_PROPERTIES_PANEL_VISIBLE,
  LOAD_NETWORK,
  NEW_NETWORK,
} from 'actions';
import { pathOr, path } from 'ramda';

const defaultValue = true;
const getNetworkPropertiesPanelVisible = pathOr(defaultValue, ['payload', 'state', 'network', 'propertiesPanelVisible']);
const getPropertiesPanelVisible = path(['payload', 'propertiesPanelVisible']);

export default (state = defaultValue, action) => {
  switch (action.type) {
    case LOAD_NETWORK:
      return getNetworkPropertiesPanelVisible(action);
    case NEW_NETWORK:
      return defaultValue;
    case UPDATE_NETWORK_PROPERTIES_PANEL_VISIBLE:
      return getPropertiesPanelVisible(action);
    default:
      return state;
  }
};
