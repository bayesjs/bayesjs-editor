import {
  CANCEL_EDITING_NODE_CPT,
  EDITING_NODE_CPT,
  SAVE_EDITING_NODE_CPT,
} from '@constants/editing-node-cpt';

export const onEditingNodeCpt = node => ({
  type: EDITING_NODE_CPT,
  payload: { node },
});

export const onCancelEditingNodeCpt = () => ({
  type: CANCEL_EDITING_NODE_CPT,
});

export const onSaveEditingNodeCpt = (id, cpt) => ({
  type: SAVE_EDITING_NODE_CPT,
  payload: { id, cpt },
});
