import { combineReducers } from 'redux';
import network from './network';

const rootReducer = combineReducers({
  network,
  nodes: () => [],
  positions: () => [],
});

export default rootReducer;
