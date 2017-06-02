import { createSelector } from 'reselect';
import { addNode, infer } from 'bayesjs';

import { NETWORK_KINDS } from '../actions';
import { 
  combNodesAndBeliefs, 
  combNodesAndPositions ,
  combLinkagesBySubnetwork,
  combLinkagesByTwoSubnetwork,
  combSubnetworksById,
  combNetworkMSBN,
  combNodesAndBeliefsMSBN,
  combAllLinkagesBySubnetwork,
  combSubnetworksColorById,
} from './combiners';

export const getNetwork = state => state.network;
export const getNodes = state => state.network.nodes || state.nodes || [];
export const getPositions = state => state.network.positions || state.positions || [];
export const getBeliefs = state => state.network.beliefs;
export const getSubnetworks = state => state.network.subnetworks || [];
export const getNetworkKind = state => state.network.kind || NETWORK_KINDS.BN;
export const getPanelVisibility = state => state.network.propertiesPanelVisible;
export const getLinkages = state => state.network.linkages;
export const getInferenceEnabled = state => state.network.inferenceEnabled === undefined ? true : state.network.inferenceEnabled;

export const getStateToSave = createSelector(
  getNetwork,
  getNodes,
  getPositions,
  getSubnetworks,
  (network, nodes, positions, subnetworks) => ({
    version: 2,
    network: {
      ...network,
      selectedNodes: [],
      beliefs: {},
      subnetworks: subnetworks.map((sub) => ({
        ...sub,
        beliefs: {},
      })),
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
  getInferenceEnabled,
  combNodesAndBeliefs
);

export const getNetworkMSBN = createSelector(
  getSubnetworks,
  getLinkages,
  combNetworkMSBN,
);

export const getInferenceResultsMSBN = createSelector(
  getSubnetworks,
  getLinkages,
  getBeliefs,
  getInferenceEnabled,
  combNodesAndBeliefsMSBN
);

export const getLinkagesBySubnetwork = createSelector(
  getLinkages,
  getSubnetworks,
  combLinkagesBySubnetwork
);

export const getAllLinkagesBySubnetworkWithoutId = createSelector(
  getLinkages,
  getSubnetworks,
  combAllLinkagesBySubnetwork
);


export const getLinkagesByTwoSubnetwork = createSelector(
  getLinkages,
  combLinkagesByTwoSubnetwork
);

export const getSubnetworksById = createSelector(
  getSubnetworks,
  combSubnetworksById
);

export const getSubnetworksColorById = createSelector(
  getSubnetworks,
  combSubnetworksColorById
);