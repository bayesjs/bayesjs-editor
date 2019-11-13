import SimpleNetwork from 'json-templates/networks/simple.json';
import { findNodeById, removeNodeById, findIndexNodeById } from './node';

describe('Node Utils', () => {
  describe('findNodeById', () => {
    const id = 'Node 2';

    it('returns node with id', () => {
      expect(findNodeById(id, SimpleNetwork)).toEqual({
        id: 'Node 2',
        states: [
          'True',
          'False',
        ],
        parents: [],
        cpt: {
          True: 0.5,
          False: 0.5,
        },
      });
    });
  });

  describe('findIndexNodeById', () => {
    const id = 'Node 2';

    it('returns index from node with id', () => {
      expect(findIndexNodeById(id, SimpleNetwork)).toBe(1);
    });
  });

  describe('removeNodeById', () => {
    const id = 'Node 3';

    it('removes node from node array by id', () => {
      expect(removeNodeById(id, SimpleNetwork)).toEqual([
        {
          id: 'Node 1',
          states: [
            'True',
            'False',
          ],
          parents: [],
          cpt: {
            True: 0.5,
            False: 0.5,
          },
        },
        {
          id: 'Node 2',
          states: [
            'True',
            'False',
          ],
          parents: [],
          cpt: {
            True: 0.5,
            False: 0.5,
          },
        },
      ]);
    });
  });
});
