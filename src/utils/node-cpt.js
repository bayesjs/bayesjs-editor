import {
  T,
  add,
  all,
  always,
  applySpec,
  assoc,
  complement,
  concat,
  cond,
  converge,
  curry,
  difference,
  dissoc,
  divide,
  equals,
  evolve,
  flatten,
  flip,
  identity,
  ifElse,
  includes,
  invertObj,
  is,
  head,
  keys,
  length,
  lensPath,
  lensProp,
  map,
  mergeRight,
  nthArg,
  objOf,
  omit,
  over,
  path,
  pick,
  pipe,
  prop,
  reject,
  set,
  subtract,
  sum,
  uniqBy,
  useWith,
  values,
} from 'ramda';
import { containsParentInNode, isNodeWithoutParents } from 'validations/node';

import { createNodeCombinations } from './combinations';
import { filterNodeParents } from './node-parents';
import { findNodeById } from './node';
import { roundValue } from './math';

const propId = prop('id');
const propCpt = prop('cpt');
const propStates = prop('states');
const propParents = prop('parents');
const isArray = is(Array);
const nthArg0 = nthArg(0);
const nthArg1 = nthArg(1);
const includesFlipped = flip(includes);
const getCptValue = converge(divide, [always(1), length]);
const getCptValueRounded = pipe(getCptValue, roundValue);
const mapAndFlatten = pipe(map, flatten);
const uniqByWhen = uniqBy(prop('when'));
const objectLenght = pipe(keys, length);
const sumValues = pipe(values, sum);
const getFirstKey = pipe(keys, head);
const getMissingValueFromCpt = pipe(sumValues, subtract(1));
const filterCptWhenByKeys = useWith(evolve, [pipe(pick, objOf('when'))]);
const mapWhen = useWith(map, [filterCptWhenByKeys, identity]);
const hasOnlyThisParent = useWith(all, [pipe(propId, equals), propParents]);
const getValueForEachCpt = useWith(pipe(divide, roundValue), [identity, length]);
const hasNoParent = useWith(complement(containsParentInNode), [
  propId,
  identity,
]);

const getMissingValueForEachCpt = converge(divide, [
  pipe(nthArg0, getMissingValueFromCpt),
  pipe(nthArg0, objectLenght),
]);

const fixCptFloatingPoint = converge(
  over,
  [
    pipe(nthArg0, getFirstKey, lensProp),
    pipe(nthArg0, getMissingValueFromCpt, roundValue, add),
    nthArg0,
  ],
);

const balanceCptValues = converge(pipe(map, fixCptFloatingPoint), [
  pipe(nthArg0, getMissingValueForEachCpt, roundValue, add),
  nthArg0,
]);

const addKeyAndValueInWhen = (key, value) =>
  set(lensPath(['when', key]), value);

const addNewStatesInCptWithValue = (value, states, cpt) =>
  mergeRight(
    cpt,
    map(always(getValueForEachCpt(value, states)), invertObj(states)),
  );

const getDiffStates = applySpec({
  deletedStates: flip(difference),
  newStates: difference,
});

const renamePropKey = curry((oldKey, newKey, obj) =>
  assoc(newKey, prop(oldKey, obj), dissoc(oldKey, obj)));

export const updateCptValue = (cpt, value, state, index) => {
  if (isArray(cpt)) {
    return set(lensPath([index, 'then', state]), value, cpt);
  }
  return assoc(state, value, cpt);
};

export const createCpt = converge(pipe(map, fixCptFloatingPoint), [
  pipe(nthArg0, getCptValueRounded, always),
  pipe(nthArg0, invertObj),
]);

const cptObjectToArray = (nodeParent, node) =>
  map(
    state => ({
      when: objOf(propId(nodeParent), state),
      then: propCpt(node),
    }),
    propStates(nodeParent),
  );

const addCptArrayItem = (nodeParent, node) => {
  const id = propId(nodeParent);

  return mapAndFlatten(
    newState => map(addKeyAndValueInWhen(id, newState), propCpt(node)),
    propStates(nodeParent),
  );
};

export const addNodeParentInCpt = ifElse(
  pipe(nthArg1, isNodeWithoutParents),
  cptObjectToArray,
  addCptArrayItem,
);

const removeParentInCptWhenNodeHasOneParent = path(['cpt', 0, 'then']);

const removeParentInCptWhenNodeHasMoreThanOneParent = (nodeParent, node) =>
  uniqByWhen(
    mapWhen(filterNodeParents(propId(nodeParent), node), propCpt(node)),
  );

export const removeNodeParentInCpt = cond([
  [hasNoParent, pipe(nthArg1, propCpt)],
  [hasOnlyThisParent, pipe(nthArg1, removeParentInCptWhenNodeHasOneParent)],
  [T, removeParentInCptWhenNodeHasMoreThanOneParent],
]);

const changeCptStates = curry((nextStates, cpt) => {
  const { deletedStates, newStates } = getDiffStates(nextStates, keys(cpt));
  const valueFromDeletedStates = roundValue(sumValues(pick(deletedStates, cpt)));

  return balanceCptValues(
    omit(
      deletedStates,
      addNewStatesInCptWithValue(valueFromDeletedStates, newStates, cpt),
    ),
  );
});

const updateStatesInCptObject = useWith(changeCptStates, [identity, propCpt]);

const updateStatesInCptArray = (nextStates, node) =>
  map(
    evolve({
      then: changeCptStates(nextStates),
    }),
    propCpt(node),
  );

export const updateStatesInCpt = ifElse(
  pipe(nthArg1, isNodeWithoutParents),
  updateStatesInCptObject,
  updateStatesInCptArray,
);

export const updateNodeParentIdInCpt = (nodeId, nextId, node) =>
  map(
    evolve({
      when: renamePropKey(nodeId, nextId),
    }),
    propCpt(node),
  );

const createWhensForNodeWithStates = (parentId, newStates, nodes, node) => {
  const nodeParents = map(id => findNodeById(id, nodes), node.parents);
  const parents = map(
    ({ id, states }) => ({
      id,
      states: equals(id, parentId) ? newStates : states,
    }),
    nodeParents,
  );

  return createNodeCombinations(parents);
};

const removeCptsForNodeWithStates = (parentId, deletedStates, node) =>
  reject(
    pipe(path(['when', parentId]), includesFlipped(deletedStates)),
    propCpt(node),
  );

const createCptsForNodeWithStates = (parentId, newStates, nodes, node) =>
  map(
    pipe(objOf('when'), assoc('then', createCpt(propStates(node)))),
    createWhensForNodeWithStates(parentId, newStates, nodes, node),
  );

export const updateNodeParentStatesInCpt = curry(
  (parentId, nextStates, nodes, node) => {
    const nodeParent = findNodeById(parentId, nodes);
    const { deletedStates, newStates } = getDiffStates(
      nextStates,
      propStates(nodeParent),
    );

    return concat(
      removeCptsForNodeWithStates(parentId, deletedStates, node),
      createCptsForNodeWithStates(parentId, newStates, nodes, node),
    );
  },
);
