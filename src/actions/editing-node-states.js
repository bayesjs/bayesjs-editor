import {
  EDITING_NODE_STATES,
  CANCEL_EDITING_NODE_STATES,
  SAVE_EDITING_NODE_STATES,
} from 'constants/editing-node-states';

export const onEditingNodeStates = node => ({
  type: EDITING_NODE_STATES,
  payload: { node },
});

export const onCancelEditingNodeStates = () => ({
  type: CANCEL_EDITING_NODE_STATES,
});

export const onSaveEditingNodeStates = (id, states, nodes) => ({
  type: SAVE_EDITING_NODE_STATES,
  payload: { id, states, nodes },
});
