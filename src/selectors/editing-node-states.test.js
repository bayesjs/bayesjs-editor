import {
  getEditingNodeStates,
} from './editing-node-states';

describe('EditingNodeStates Selectors', () => {
  const editingNodeStates = {
    id: 'node-id',
    states: ['True', 'False'],
    cpt: {
      True: 0.5,
      False: 0.5,
    },
    parents: [],
  };
  const store = { editingNodeStates };

  describe('getEditingNodeStates', () => {
    it('gets editing node states', () => {
      expect(getEditingNodeStates(store)).toEqual(editingNodeStates);
    });
  });
});
