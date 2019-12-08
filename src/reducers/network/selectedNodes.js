import {
  UPDATE_NETWORK_SELECTED_NODES,
  REMOVE_NODE,
  CHANGE_NODE_ID,
  LOAD_NETWORK,
  NEW_NETWORK,
} from 'actions';
import { updateSelectedNodesId } from 'utils/network';
import { path } from 'ramda';

const defaultValue = [];
const getSelectedNodes = path(['payload', 'selectedNodes']);

export default (state = defaultValue, action) => {
  switch (action.type) {
    case UPDATE_NETWORK_SELECTED_NODES:
      return getSelectedNodes(action);
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
