import {
  any,
  append,
  complement,
  equals,
  filter,
  identity,
  isEmpty,
  lensPath,
  map,
  over,
  pick,
  pipe,
  prop,
  reject,
  useWith,
} from 'ramda';

import { findIndexNodeById } from '@utils/node';
import { containsParentInNode } from './node';

const isNotEmpty = complement(isEmpty);
const propId = prop('id');
const propParents = prop('parents');
const mapIdAndParents = map(pick(['id', 'parents']));
const hasEmptyParents = pipe(propParents, isEmpty);
const filterEmptyParentNodes = filter(hasEmptyParents);
const anyNodesHasNoEmptyParents = any(complement(hasEmptyParents));

const getNodesWithParents = useWith(
  filter,
  [containsParentInNode, identity],
);

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

const addNodeParentInNodes = (id, parentId, nodes) => over(
  lensPath([findIndexNodeById(id, nodes), 'parents']),
  append(parentId),
  nodes,
);

export const hasCycleAddingNodeParent = (parentId, nodeId, nodes) =>
  hasCycles(addNodeParentInNodes(nodeId, parentId, nodes));
