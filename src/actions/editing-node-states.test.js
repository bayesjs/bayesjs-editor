import {
  EDITING_NODE_STATES,
  CANCEL_EDITING_NODE_STATES,
  SAVE_EDITING_NODE_STATES,
} from 'constants/editing-node-states';
import {
  onCancelEditingNodeStates,
  onEditingNodeStates,
  onSaveEditingNodeStates,
} from './editing-node-states';

describe('EditingNodeStates Actions', () => {
  const id = 'node-id';
  const cpt = {
    True: 0.4,
    False: 0.6,
  };
  const states = ['True', 'False'];
  const nodes = [
    { id: 'node-1' },
    { id: 'node-2' },
    { id: 'node-3' },
  ];

  describe('onCancelEditingNodeStates', () => {
    it('creates an action to cancel editing node states', () => {
      expect(onCancelEditingNodeStates()).toEqual({
        type: CANCEL_EDITING_NODE_STATES,
      });
    });
  });

  describe('onEditingNodeStates', () => {
    const node = { id, cpt };

    it('creates an action to start to editing node states', () => {
      expect(onEditingNodeStates(node)).toEqual({
        type: EDITING_NODE_STATES,
        payload: { node },
      });
    });
  });

  describe('onSaveEditingNodeStates', () => {
    it('creates an action to save editing node states', () => {
      expect(onSaveEditingNodeStates(id, states, nodes)).toEqual({
        type: SAVE_EDITING_NODE_STATES,
        payload: { id, states, nodes },
      });
    });
  });
});
