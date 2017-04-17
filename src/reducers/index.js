import { combineReducers } from 'redux';
import network from './network';
import nodes from './nodes';
import positions from './positions';
import arrows from './arrows';

const rootReducer = combineReducers({
  network,
  nodes: (state = []) => [],
  positions: (state = []) => [],
});

export default rootReducer;
