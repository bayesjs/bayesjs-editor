import { combineReducers } from 'redux';
import network from './network';
import editingNodeCpt from './editing-node-cpt';

const rootReducer = combineReducers({
  network,
  editingNodeCpt,
  nodes: () => [],
  positions: () => [],
});

export default rootReducer;
