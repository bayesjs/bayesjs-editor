import {
  is,
  assoc,
  set,
  lensPath,
} from 'ramda';

const isArray = is(Array);

export const updateCptValue = (cpt, value, state, index) => {
  if (isArray(cpt)) {
    return set(lensPath([index, 'then', state]), value, cpt);
  }
  return assoc(state, value, cpt);
};
