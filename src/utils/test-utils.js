import {
  compose,
  filter,
  isEmpty,
  join,
  map,
  not,
} from 'ramda';

import { kebabCase } from 'change-case';
import removeAccents from 'remove-accents';

const formatWord = compose(removeAccents, kebabCase);
const notEmpty = compose(not, isEmpty);
const filterSubItems = filter(notEmpty);
const formatSubItems = compose(join('-'), map(formatWord));

export const getComponentTestId = (componentName, ...subItems) => { //eslint-disable-line
  const compName = formatWord(componentName);
  const filtredItems = filterSubItems(subItems);

  return notEmpty(filtredItems) ? `${compName}__${formatSubItems(filtredItems)}` : compName;
};
