import { combineReducers } from 'redux';
import nodesRed from './nodes';
import positionsRed from './positions';
import subnetworkRed from './subnetwork';
import linkagesRed from './linkages';
import { v4 } from 'uuid';

const ReducerNode = nodesRed;
const ReducerPosition = positionsRed;
const ReducerSubNetwork = subnetworkRed;
const ReducerLinkages = linkagesRed;

import {
  NEW_NETWORK,
  LOAD_NETWORK,
  CHANGE_NETWORK_PROPERTY,
  REMOVE_NODE,
  CHANGE_NODE_ID,
  SET_BELIEF,
  NETWORK_KINDS,
  UNDO,
  REDO,
} from '../actions';

const initialState = {
  id: '',
  name: 'Rede Bayesiana',
  height: 500,
  width: 800,
  selectedNodes: [],
  beliefs: {},
  propertiesPanelVisible: true,
  kind: NETWORK_KINDS.BN,
  nodes: [],
  positions: [],
  subnetworks: []
};

const changeBelife = (beliefs, state, id) => {
  if (state == null) {
    delete beliefs[id];
  } else {
    beliefs[id] = state;
  }

  return beliefs;
};

const setBelief = (state, action) => {
  const beliefs = { ...state.beliefs };
  const { nodeId, subnetworkId } = action.payload;
  
  if (subnetworkId) {
    const beliefsSubnet = beliefs[subnetworkId] || {};
    const subnetwork = state.subnetworks
      .find(s => s.id == subnetworkId);
    
    beliefs[subnetworkId] = changeBelife(beliefsSubnet, action.payload.state, nodeId);
    subnetwork.beliefs = changeBelife(subnetwork.beliefs, action.payload.state, nodeId)

  } else {
    changeBelife(beliefs, action.payload.state, nodeId);
  }

  return {
    ...state,
    beliefs,
  };
};

const completeReducer = (state, action) => (finalState) => {
  const nodes = ReducerNode(state.nodes, action);
  const positions = ReducerPosition(state.positions, action);
  const subnetworks = ReducerSubNetwork(state.subnetworks, action);
  const linkages = ReducerLinkages(state.linkages, action);
  
  return {
    ...finalState,
    nodes,
    positions,
    subnetworks,
    linkages,
  };
}

export default (state = initialState, action) => {
  const completer = completeReducer(state, action);
  
  switch (action.type) {
    case NEW_NETWORK:
      const { kind } = action;

      return completer({
        ...initialState,
        id: v4(),
        kind
      });
    case LOAD_NETWORK:
      let { network, nodes, positions } = action.payload.state

      if (network.kind === undefined) network.kind = NETWORK_KINDS.BN;
      if (network.id === undefined) network.id = v4();

      if (nodes && positions) {
        network = {
          ...network,
          nodes,
          positions
        };
      }
      
      return completer(network);
    case CHANGE_NETWORK_PROPERTY:
      return completer({
        ...state,
        [action.payload.name]: action.payload.value,
      });
    case REMOVE_NODE:
      return completer({
        ...state,
        selectedNodes: [],
      });
    case CHANGE_NODE_ID:
      return completer({
        ...state,
        selectedNodes: state.selectedNodes.map(x =>
          (x === action.payload.id ? action.payload.nextId : x)
        ),
      });
    case SET_BELIEF:
      return completer({
        ...setBelief(state, action)
      });
    default:
      return completer({
        ...state,
      });
  }
};
