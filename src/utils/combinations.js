import {
  assoc,
  forEach,
  head,
  isEmpty,
  tail,
} from 'ramda';

const createCombinations = (onCreateCombination, allNodes, acc = {}) => {
  if (isEmpty(allNodes)) {
    onCreateCombination(acc);
  } else {
    const { id, states } = head(allNodes);

    forEach((state) => {
      createCombinations(onCreateCombination, tail(allNodes), assoc(id, state, acc));
    }, states);
  }
};

export const createNodeCombinations = (nodes) => {
  const combinations = [];

  createCombinations(
    combination => combinations.push(combination),
    nodes,
  );

  return combinations;
};
