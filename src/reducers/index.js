import { combineReducers } from 'redux';
import network from './network';
import nodes from './nodes';

const rootReducer = combineReducers({
  network,
  nodes,
});

export default rootReducer;
