import {
  CANCEL_EDITING_NODE_STATES,
  EDITING_NODE_STATES,
  SAVE_EDITING_NODE_STATES,
} from '@constants/editing-node-states';
import { path, pick, pipe } from 'ramda';

const pickNodeProps = pick(['id', 'cpt', 'states', 'parents']);
const pathPayloadNode = path(['payload', 'node']);
const getNodeFromAction = pipe(pathPayloadNode, pickNodeProps);

export default (state = null, action) => {
  switch (action.type) {
    case EDITING_NODE_STATES:
      return getNodeFromAction(action);
    case CANCEL_EDITING_NODE_STATES:
    case SAVE_EDITING_NODE_STATES:
      return null;
    default:
      return state;
  }
};
