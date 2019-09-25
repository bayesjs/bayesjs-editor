import { combineReducers } from 'redux';
import network from './network';
import editingNodeCpt from './editing-node-cpt';
import editingNodeStates from './editing-node-states';

const rootReducer = combineReducers({
  network,
  editingNodeCpt,
  editingNodeStates,
  nodes: () => [],
  positions: () => [],
});

export default rootReducer;
