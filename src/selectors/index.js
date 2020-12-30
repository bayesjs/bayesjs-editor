import {
  combAllLinkagesBySubnetwork,
  combLinkagesBySubnetwork,
  combLinkagesByTwoSubnetwork,
  combNetworkMSBNDescription,
  combNodesAndBeliefs,
  combNodesAndBeliefsMSBN,
  combNodesIsSelected,
  combNodesWithPositions,
  combNodesWithSizes,
  combSubnetworksById,
  combSubnetworksColorById,
} from './combiners';
import {
  either,
  path,
  pathOr,
  prop,
  propOr,
} from 'ramda';

import { NETWORK_KINDS } from '@constants/network';
import { createSelector } from 'reselect';

export const getNetwork = prop('network');
export const getNodes = either(path(['network', 'nodes']), propOr([], 'nodes'));
export const getPositions = either(path(['network', 'positions']), propOr([], 'positions'));
export const getBeliefs = path(['network', 'beliefs']);
export const getSelectedNodes = path(['network', 'selectedNodes']);
export const getSubnetworks = pathOr([], ['network', 'subnetworks']);
export const getNetworkKind = pathOr(NETWORK_KINDS.BN, ['network', 'kind']);
export const getPanelVisibility = path(['network', 'propertiesPanelVisible']);
export const getLinkages = path(['network', 'linkages']);

export const getInferenceEnabled = (state) => {
  const { inferenceEnabled } = getNetwork(state);

  return inferenceEnabled === undefined ? true : inferenceEnabled;
};

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
      subnetworks: subnetworks.map(sub => ({
        ...sub,
        beliefs: {},
      })),
    },
    nodes,
    positions,
  }),
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

export const getNodesWithPositionsAndSizes = createSelector(
  getNodes,
  getPositions,
  getSelectedNodes,
  (nodes, position, selectedNodes) =>
    combNodesWithSizes(
      combNodesIsSelected(
        combNodesWithPositions(nodes, position),
        selectedNodes,
      ),
    ),
);

export const getSubnetworksWithPositionAndSizes = createSelector(
  getSubnetworks,
  getPositions,
  getSelectedNodes,
  (subnetworks, positions, selectedNodes) => combNodesWithSizes(
    combNetworkMSBNDescription(
      combNodesIsSelected(
        combNodesWithPositions(subnetworks, positions),
        selectedNodes,
      ),
    ),
  ),
);

export const getInferenceResults = createSelector(
  getNodes,
  getBeliefs,
  getInferenceEnabled,
  combNodesAndBeliefs,
);

export const getInferenceResultsMSBN = createSelector(
  getSubnetworks,
  getLinkages,
  getBeliefs,
  getInferenceEnabled,
  combNodesAndBeliefsMSBN,
);

export const getLinkagesBySubnetwork = createSelector(
  getLinkages,
  getSubnetworks,
  combLinkagesBySubnetwork,
);

export const getAllLinkagesBySubnetworkWithoutId = createSelector(
  getLinkages,
  getSubnetworks,
  combAllLinkagesBySubnetwork,
);


export const getLinkagesByTwoSubnetwork = createSelector(
  getLinkages,
  combLinkagesByTwoSubnetwork,
);

export const getSubnetworksById = createSelector(
  getSubnetworks,
  combSubnetworksById,
);

export const getSubnetworksColorById = createSelector(
  getSubnetworks,
  combSubnetworksColorById,
);
