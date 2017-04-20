import { createSelector } from 'reselect';
import { addNode, infer } from 'bayesjs';

import { NETWORK_KINDS } from '../actions';
import { combNodesAndBeliefs, combNodesAndPositions } from './combiners';

export const getNetwork = state => state.network;
export const getNodes = state => state.network.nodes || state.nodes || [];
export const getPositions = state => state.network.positions || state.positions || [];
export const getBeliefs = state => state.network.beliefs;
export const getSubnetworks = state => state.network.subnetworks || [];
export const getNetworkKind = state => state.network.kind || NETWORK_KINDS.BN;
export const getPanelVisibility = state => state.network.propertiesPanelVisible;
export const getLinkages = state => state.network.linkages;

export const getStateToSave = createSelector(
  getNetwork,
  getNodes,
  getPositions,
  (network, nodes, positions) => ({
    version: 2,
    network: {
      ...network,
      selectedNodes: [],
      beliefs: {},
    },
    nodes,
    positions,
  })
);

export const getSelectedNode = createSelector(
  getNetwork,
  getNodes,
  (network, nodes) => {
    if (network.selectedNodes.length !== 1) {
      return null;
    }

    return nodes.find(x => x.id === network.selectedNodes[0]);
  },
);

export const getSelectedSubnetwork = createSelector(
  getNetwork,
  getSubnetworks,
  (network, subnetworks) => {
    if (network.selectedNodes.length !== 1) {
      return null;
    }

    return subnetworks.find(sub => sub.id === network.selectedNodes[0]);
  },
);

export const getNodesWithPositions = createSelector(
  getNodes,
  getPositions,
  combNodesAndPositions
);

export const getSubnetworksWithPosition = createSelector(
  getSubnetworks,
  getPositions,
  combNodesAndPositions
);

export const getInferenceResults = createSelector(
  getNodes,
  getBeliefs,
  combNodesAndBeliefs
);