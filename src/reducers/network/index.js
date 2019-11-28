import { combineReducers } from 'redux';
import id from './id';
import name from './name';
import height from './height';
import width from './width';
import selectedNodes from './selectedNodes';
import beliefs from './beliefs';
import propertiesPanelVisible from './propertiesPanelVisible';
import kind from './kind';
import inferenceEnabled from './inferenceEnabled';
import description from './description';
import nodes from './nodes';
import positions from './positions';
import subnetworks from './subnetworks';
import linkages from './linkages';

export default combineReducers({
  id,
  name,
  height,
  width,
  selectedNodes,
  beliefs,
  propertiesPanelVisible,
  kind,
  inferenceEnabled,
  description,
  nodes,
  positions,
  subnetworks,
  linkages,
});
