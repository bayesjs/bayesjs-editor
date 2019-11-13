import {
  append,
  apply,
  flatten,
  flip,
  length,
  liftN,
  map,
  mergeAll,
  objOf,
  pipe,
  reduce,
  unapply,
} from 'ramda';

const applyAndFlatten = pipe(apply, flatten);
const liftNFlipped = flip(liftN);

const createNodeIdAndStatesCombinations = ({ id, states }) => reduce(
  (acc, state) => append(objOf(id, state), acc),
  [],
  states,
);

const liftCombinationsForArray = pipe(length, liftNFlipped(unapply(mergeAll)));

export const createNodeCombinations = (nodes) => {
  const combinations = map(createNodeIdAndStatesCombinations, nodes);
  const liftCombinations = liftCombinationsForArray(combinations);

  return applyAndFlatten(liftCombinations, combinations);
};
