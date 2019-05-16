import {
  has,
  is,
  allPass,
  pipe,
  prop,
  not,
} from 'ramda';

const isArray = is(Array);
const isObject = is(Object);

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
