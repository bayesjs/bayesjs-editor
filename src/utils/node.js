import {
  find,
  findIndex,
  identity,
  propEq,
  reject,
  useWith,
} from 'ramda';

const propId = propEq('id');

export const findNodeById = useWith(
  find,
  [propId, identity],
);

export const findIndexNodeById = useWith(
  findIndex,
  [propId, identity],
);

export const removeNodeById = useWith(
  reject,
  [propId, identity],
);
