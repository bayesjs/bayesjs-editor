import { combineReducers } from 'redux';
import nodes from './nodes';
import drag from './drag';

export default combineReducers({
  nodes,
  drag
});
