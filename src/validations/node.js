import {
  has,
  is,
  allPass,
  pipe,
  prop,
  not,
  values,
  sum,
  compose,
  equals,
  all,
} from 'ramda';
import float from 'float';
import { NODE_CPT_PRECISION } from 'constants/node';

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

export const hasStates = allPass([
  has('states'),
  propIsArray('states'),
]);

export const hasDescription = ({ showDescription, description }) =>
  Boolean(showDescription && description);

const formatFloatValue = value => float.round(value, NODE_CPT_PRECISION);

const isSumValuesEqualsOne = pipe(sumValues, formatFloatValue, equalsOne);
const isAllThenSumValuesEqualsOne = all(pipe(propThen, isSumValuesEqualsOne));

export const isNodeCptValid = (cpt) => {
  if (isArray(cpt)) {
    return isAllThenSumValuesEqualsOne(cpt);
  }
  return isSumValuesEqualsOne(cpt);
};
