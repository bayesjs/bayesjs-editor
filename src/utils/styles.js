import {
  merge,
  isNil,
  head,
  keys,
  pipe,
  reduce,
  join,
  split,
  filter,
  assoc,
  map,
} from 'ramda';
import classNames from 'classnames';

const getFirstKey = pipe(keys, head);
const joinDash = join('--');
const joinUnder = join('__');
const joinEmptySpace = join(' ');
const filterByTruthy = filter(Boolean);
const splitEmtpy = split(' ');

const joinDashElement = elementName => value => joinDash([elementName, value]);
const mapObjectKeys = (mapperFunc, obj) =>
  reduce((acc, key) => assoc(mapperFunc(key), obj[key], acc), {}, keys(obj));

const formatModifiers = (elementName, modifiers) =>
  mapObjectKeys(joinDashElement(elementName), modifiers);

const getElementName = (styles, element) => {
  const firstKey = getFirstKey(styles);

  return isNil(element) ? firstKey : joinUnder([firstKey, element]);
};

const getElementsNames = (element, modifiers) => {
  const elementNames = classNames(element, formatModifiers(element, modifiers));

  return splitEmtpy(elementNames);
};

const getObjectValues = (obj, objKeys) =>
  joinEmptySpace(filterByTruthy(map(key => obj[key], objKeys)));

const buildClassNames = (styles, element, modifiers) => {
  const elementName = getElementName(styles, element);
  const elementsNames = getElementsNames(elementName, modifiers);

  return getObjectValues(styles, elementsNames);
};

export const bem = (styles, element, modifiers = {}) => ({
  toString: () => buildClassNames(styles, element, modifiers),
  element: name => bem(styles, name, modifiers),
  modifiers: newModifiers => bem(styles, element, merge(modifiers, newModifiers)),
});
