import {
  CANCEL_EDITING_NODE_CPT,
  EDITING_NODE_CPT,
  SAVE_EDITING_NODE_CPT,
} from '@constants/editing-node-cpt';
import { path, pick, pipe } from 'ramda';

const pickNodeProps = pick(['id', 'cpt', 'states', 'parents']);
const pathPayloadNode = path(['payload', 'node']);
const getNodeFromAction = pipe(pathPayloadNode, pickNodeProps);

export default (state = null, action) => {
  switch (action.type) {
    case EDITING_NODE_CPT:
      return getNodeFromAction(action);
    case CANCEL_EDITING_NODE_CPT:
    case SAVE_EDITING_NODE_CPT:
      return null;
    default:
      return state;
  }
};
