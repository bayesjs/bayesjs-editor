import {
  CHANGE_NODE_ID,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_NODE,
  UPDATE_NETWORK_SELECTED_NODES,
} from '@actions';

import { path } from 'ramda';
import { updateSelectedNodesId } from '@utils/network';

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
