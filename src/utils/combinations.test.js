import { createNodeCombinations } from './combinations';

describe('Combinations Utils', () => {
  describe('createNodeCombinations', () => {
    const nodes = [
      {
        id: 'Node 1',
        states: ['True', 'False'],
      },
      {
        id: 'Node 2',
        states: ['True', 'False'],
      },
      {
        id: 'Node 3',
        states: ['State 1', 'State 2', 'State 3'],
      },
    ];

    it('returns combinations between nodes id and states', () => {
      expect(createNodeCombinations(nodes)).toEqual([
        { 'Node 1': 'True', 'Node 2': 'True', 'Node 3': 'State 1' },
        { 'Node 1': 'True', 'Node 2': 'True', 'Node 3': 'State 2' },
        { 'Node 1': 'True', 'Node 2': 'True', 'Node 3': 'State 3' },
        { 'Node 1': 'True', 'Node 2': 'False', 'Node 3': 'State 1' },
        { 'Node 1': 'True', 'Node 2': 'False', 'Node 3': 'State 2' },
        { 'Node 1': 'True', 'Node 2': 'False', 'Node 3': 'State 3' },
        { 'Node 1': 'False', 'Node 2': 'True', 'Node 3': 'State 1' },
        { 'Node 1': 'False', 'Node 2': 'True', 'Node 3': 'State 2' },
        { 'Node 1': 'False', 'Node 2': 'True', 'Node 3': 'State 3' },
        { 'Node 1': 'False', 'Node 2': 'False', 'Node 3': 'State 1' },
        { 'Node 1': 'False', 'Node 2': 'False', 'Node 3': 'State 2' },
        { 'Node 1': 'False', 'Node 2': 'False', 'Node 3': 'State 3' },
      ]);
    });
  });
});
