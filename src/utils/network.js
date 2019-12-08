import {
  ifElse,
  pipe,
  nthArg,
  assoc,
  dissoc,
  isNil,
  equals,
  converge,
  map,
  path,
  when,
  always,
} from 'ramda';

export const updateNetworkBelief = ifElse(
  pipe(nthArg(1), isNil),
  converge(dissoc, [nthArg(0), nthArg(2)]),
  assoc,
);

export const updateSelectedNodesId = converge(
  map,
  [
    converge(when, [
      pipe(path(['payload', 'id']), equals),
      pipe(path(['payload', 'nextId']), always),
    ]),
    nthArg(1),
  ],
);
