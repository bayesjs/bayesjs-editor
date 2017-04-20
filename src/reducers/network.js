import { combineReducers } from 'redux';
import nodesRed from './nodes';
import positionsRed from './positions';
import subnetworkRed from './subnetwork';
import linkagesRed from './linkages';

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
  NETWORK_KINDS
} from '../actions';

const initialState = {
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

const setBelief = (state, action) => {
  const beliefs = { ...state.beliefs };

  if (action.payload.state == null) {
    delete beliefs[action.payload.id];
  } else {
    beliefs[action.payload.id] = action.payload.state;
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
        kind
      });
    case LOAD_NETWORK:
      let { network, nodes, positions } = action.payload.state

      if (network.kind === undefined) network.kind = NETWORK_KINDS.BN;

      if (nodes && positions) {
        return {
          ...network,
          nodes,
          positions
        };
      }
      
      return network;
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
