import { prop, either, includes } from 'ramda';

const KEYBOARD_KEYS = {
  BACKSPACE: 8,
  DELETE: 46,
  ENTER: 13,
};

const deleteEvents = [KEYBOARD_KEYS.BACKSPACE, KEYBOARD_KEYS.DELETE];
const enterEvents = [KEYBOARD_KEYS.ENTER];
const getEventKey = either(prop('keyCode'), prop('which'));

const anyOfThesesKeys = keys => (event) => {
  const key = getEventKey(event);

  return includes(key, keys);
};

export const isDeleteKey = anyOfThesesKeys(deleteEvents);
export const isEnterKey = anyOfThesesKeys(enterEvents);
