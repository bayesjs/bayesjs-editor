import { createSelector } from 'reselect';
import { addNode, infer } from 'bayesjs';

export const getNetwork = state => state.network;
export const getNodes = state => state.nodes;

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

export const getInferenceResults = createSelector(
  getNodes,
  nodes => {
    let network = {};

    const remainingNodes = [...nodes];

    while (remainingNodes.length > 0) {
      const nodesToAdd = [];

      for (let i = 0; i < remainingNodes.length; i++) {
        if (remainingNodes[i].parents.every(p => network.hasOwnProperty(p))) {
          nodesToAdd.push(remainingNodes.splice(i, 1)[0]);
        }
      }

      nodesToAdd.forEach(nodeToAdd => {
        network = addNode(network, nodeToAdd);
      });
    }

    const results = {};

    nodes.forEach(node => {
      results[node.id] = {};

      node.states.forEach(state => {
        results[node.id][state] = infer(network, { [node.id]: state });
      });
    });

    return results;
  }
);
