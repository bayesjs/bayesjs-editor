import {
  CANCEL_EDITING_NODE_CPT,
  EDITING_NODE_CPT,
  SAVE_EDITING_NODE_CPT,
} from '@constants/editing-node-cpt';
import {
  onCancelEditingNodeCpt,
  onEditingNodeCpt,
  onSaveEditingNodeCpt,
} from './editing-node-cpt';

describe('EditingNodeCpt Actions', () => {
  const id = 'node-id';
  const cpt = {
    True: 0.4,
    False: 0.6,
  };

  describe('onCancelEditingNodeCpt', () => {
    it('creates an action to cancel editing node cpt', () => {
      expect(onCancelEditingNodeCpt()).toEqual({
        type: CANCEL_EDITING_NODE_CPT,
      });
    });
  });

  describe('onEditingNodeCpt', () => {
    const node = { id, cpt };

    it('creates an action to start to editing node cpt', () => {
      expect(onEditingNodeCpt(node)).toEqual({
        type: EDITING_NODE_CPT,
        payload: { node },
      });
    });
  });

  describe('onSaveEditingNodeCpt', () => {
    it('creates an action to save editing node cpt', () => {
      expect(onSaveEditingNodeCpt(id, cpt)).toEqual({
        type: SAVE_EDITING_NODE_CPT,
        payload: { id, cpt },
      });
    });
  });
});
