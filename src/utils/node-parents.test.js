import { filterNodeParents, addNodeParent, changeNodeParentName } from './node-parents';

describe('Node Parents Utils', () => {
  describe('filterNodeParents', () => {
    const parentId = 'Node 4';
    const node = {
      id: 'Node 1',
      parents: ['Node 2', 'Node 3', 'Node 4'],
    };

    it('returns parents without parentId', () => {
      expect(filterNodeParents(parentId, node)).toEqual([
        'Node 2', 'Node 3',
      ]);
    });
  });

  describe('addNodeParent', () => {
    const parentId = 'Node 4';
    const node = {
      id: 'Node 1',
      parents: ['Node 2', 'Node 3'],
    };

    it('returns parents with new parentId', () => {
      expect(addNodeParent(parentId, node)).toEqual(['Node 2', 'Node 3', 'Node 4']);
    });
  });

  describe('changeNodeParentName', () => {
    const parentId = 'Node 3';
    const nextParentId = 'New Node';
    const node = {
      id: 'Node 1',
      parents: ['Node 2', 'Node 3', 'Node 4'],
    };

    it('replaces old id for the new one', () => {
      expect(changeNodeParentName(parentId, nextParentId, node)).toEqual(['Node 2', 'New Node', 'Node 4']);
    });
  });
});
