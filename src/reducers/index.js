import { combineReducers } from 'redux';
import network from './network';
import nodes from './nodes';
import positions from './positions';
import arrows from './arrows';
import undoable from 'redux-undo';

const rootReducer = combineReducers({
  network: network,
  nodes: (state = []) => [],
  positions: (state = []) => [],
});

export default rootReducer;
