import {
  getEditingNodeCpt,
} from './editing-node-cpt';

describe('EditingNodeCpt Selectors', () => {
  const editingNodeCpt = {
    id: 'node-id',
    states: ['True', 'False'],
    cpt: {
      True: 0.5,
      False: 0.5,
    },
    parents: [],
  };
  const store = { editingNodeCpt };

  describe('getEditingNodeCpt', () => {
    it('gets editing node cpt', () => {
      expect(getEditingNodeCpt(store)).toEqual(editingNodeCpt);
    });
  });
});
