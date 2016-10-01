import { combineReducers } from 'redux';
import network from './network';
import nodes from './nodes';
import positions from './positions';

const rootReducer = combineReducers({
  network,
  nodes,
  positions,
});

export default rootReducer;
