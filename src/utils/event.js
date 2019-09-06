import { prop, either, includes } from 'ramda';

const KEYBOARD_KEYS = {
  BACKSPACE: 8,
  DELETE: 46,
};

const deleteEvents = [KEYBOARD_KEYS.BACKSPACE, KEYBOARD_KEYS.DELETE];
const getEventKey = either(prop('keyCode'), prop('which'));

export const isDeleteKey = (event) => {
  const key = getEventKey(event);

  return includes(key, deleteEvents);
};
