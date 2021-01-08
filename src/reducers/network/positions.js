import {
  ADD_NODE,
  ADD_SUPER_NODE,
  CHANGE_NODE_ID,
  CHANGE_NODE_POSITION,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_NODE,
} from '@actions';
import {
  assoc,
  dissoc,
  identity,
  lens,
  over,
  path,
  pick,
  pipe,
  prop,
} from 'ramda';

const propPayload = prop('payload');
const pathPayloadId = pipe(propPayload, prop('id'));
const pathPayloadNextId = pipe(propPayload, prop('nextId'));
const pathPayloadPosition = pipe(propPayload, prop('position'));
const pathPayloadStatePositions = path(['payload', 'state', 'positions']);
const getPayloadPosition = pipe(propPayload, pick(['x', 'y']));

const renamePropKey = (oldName, newName, obj) =>
  pipe(
    over(lens(prop(oldName), assoc(newName)), identity),
    dissoc(oldName),
  )(obj);

export default (state = {}, action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return {};
    case LOAD_NETWORK:
      return pathPayloadStatePositions(action);
    case ADD_NODE:
    case ADD_SUPER_NODE:
      return assoc(pathPayloadId(action), pathPayloadPosition(action), state);
    case REMOVE_NODE:
      return dissoc(pathPayloadId(action), state);
    case CHANGE_NODE_ID:
      return renamePropKey(pathPayloadId(action), pathPayloadNextId(action), state);
    case CHANGE_NODE_POSITION:
      return assoc(pathPayloadId(action), getPayloadPosition(action), state);
    default:
      return state;
  }
};
