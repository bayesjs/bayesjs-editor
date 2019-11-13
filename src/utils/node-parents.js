import {
  always,
  append,
  equals,
  identity,
  map,
  prop,
  reject,
  useWith,
  when,
} from 'ramda';

const propParents = prop('parents');

export const filterNodeParents = useWith(
  reject,
  [equals, propParents],
);

export const addNodeParent = useWith(
  append,
  [identity, propParents],
);

export const changeNodeParentName = (parentId, nextParentId, node) =>
  map(
    when(equals(parentId), always(nextParentId)),
    propParents(node),
  );
