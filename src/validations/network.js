import {
  map,
  isEmpty,
  reject,
  equals,
  filter,
  pipe,
  prop,
  pick,
  includes,
  any,
  complement,
} from 'ramda';

const isNotEmpty = complement(isEmpty);
const propId = prop('id');
const propParents = prop('parents');
const mapIdAndParents = map(pick(['id', 'parents']));

const hasEmptyParents = pipe(propParents, isEmpty);
const filterEmptyParentNodes = filter(hasEmptyParents);
const anyNodesHasNoEmptyParents = any(complement(hasEmptyParents));

const hasParentsWithId = id => pipe(propParents, includes(id));

const getNodesWithParents = (parentId, nodes) =>
  filter(hasParentsWithId(parentId), nodes);

const removeParentFromNode = (node, parentId) => {
  node.parents = reject(equals(parentId), propParents(node));
};

// Kahn's algorithm https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
export const hasCycles = (nodes) => {
  const clonedNodes = mapIdAndParents(nodes);
  const nodesWithEmptyParents = filterEmptyParentNodes(clonedNodes);
  const sortedElements = [];

  while (isNotEmpty(nodesWithEmptyParents)) {
    const nodeWithoutParent = nodesWithEmptyParents.shift();

    sortedElements.push(nodeWithoutParent);

    getNodesWithParents(propId(nodeWithoutParent), clonedNodes).forEach((childNode) => {
      removeParentFromNode(childNode, propId(nodeWithoutParent));

      if (hasEmptyParents(childNode)) {
        nodesWithEmptyParents.push(childNode);
      }
    });
  }

  return anyNodesHasNoEmptyParents(clonedNodes);
};
