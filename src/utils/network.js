import {
  ifElse,
  pipe,
  nthArg,
  assoc,
  dissoc,
  isNil,
  equals,
  prop,
  curry,
  converge,
  map,
  path,
  when,
  always,
} from 'ramda';

const propPayload = prop('payload');

export const updateNetworkBelief = ifElse(
  pipe(nthArg(1), isNil),
  converge(dissoc, [nthArg(0), nthArg(2)]),
  assoc,
);

export const updateNetworkProperty = curry((propName, currentValue, action) => {
  const { name, value } = propPayload(action);

  return equals(name, propName) ? value : currentValue;
});

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
