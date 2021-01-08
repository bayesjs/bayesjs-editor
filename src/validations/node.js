import {
  all,
  allPass,
  any,
  compose,
  equals,
  has,
  ifElse,
  is,
  isEmpty,
  not,
  pipe,
  prop,
  sum,
  useWith,
  values,
} from 'ramda';

import { roundValue } from '@utils/math';

const isArray = is(Array);
const isObject = is(Object);
const sumValues = compose(sum, values);
const equalsOne = equals(1);
const propThen = prop('then');

const propIsArray = myProp => pipe(prop(myProp), isArray);
const propIsNotArray = myProp => pipe(prop(myProp), isArray, not);
const propIsObject = myProp => pipe(prop(myProp), isObject);

export const hasConnections = allPass([
  has('linkedNode'),
  propIsNotArray('linkedNode'),
  propIsObject('linkedNode'),
]);

export const hasStates = allPass([has('states'), propIsArray('states')]);

export const hasDescription = ({ showDescription, description }) =>
  Boolean(showDescription && description);

const isSumValuesEqualsOne = pipe(sumValues, roundValue, equalsOne);
const isAllThenSumValuesEqualsOne = all(pipe(propThen, isSumValuesEqualsOne));

export const isNodeCptValid = ifElse(
  isArray,
  isAllThenSumValuesEqualsOne,
  isSumValuesEqualsOne,
);

export const isNodeWithoutParents = pipe(prop('parents'), isEmpty);

export const containsParentInNode = useWith(any, [equals, prop('parents')]);
