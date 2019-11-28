import {
  CHANGE_NETWORK_PROPERTY,
  REMOVE_NODE,
  CHANGE_NODE_ID,
  LOAD_NETWORK,
  NEW_NETWORK,
} from 'actions';
import { updateNetworkProperty, updateSelectedNodesId } from 'utils/network';

const defaultValue = [];
const updateProperty = updateNetworkProperty('selectedNodes');

export default (state = defaultValue, action) => {
  switch (action.type) {
    case CHANGE_NETWORK_PROPERTY:
      return updateProperty(state, action);
    case LOAD_NETWORK:
    case NEW_NETWORK:
    case REMOVE_NODE:
      return defaultValue;
    case CHANGE_NODE_ID:
      return updateSelectedNodesId(action, state);
    default:
      return state;
  }
};
