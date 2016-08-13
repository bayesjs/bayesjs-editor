import { createSelector } from 'reselect';
import { addNode, infer } from 'bayesjs';

export const getNetwork = state => state.network;
export const getNodes = state => state.nodes;

export const getInferenceResults = createSelector(
  getNodes,
  nodes => {
    const network = nodes.reduce(
      (acc, x) => addNode(acc, x)
    , {});

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
