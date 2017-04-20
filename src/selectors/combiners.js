import { addNode, infer } from 'bayesjs';

export const combNodesAndPositions = (nodes, positions) => nodes.map(node => ({
  ...node,
  position: positions[node.id],
}));

export const combNodesAndBeliefs = (nodes, beliefs) => {
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
      results[node.id][state] = infer(
        network,
        { [node.id]: state },
        Object.keys(beliefs).length === 0 ? undefined : beliefs,
      );
    });
  });

  return results;
};
