import {
  EDITING_NODE_CPT,
  CANCEL_EDITING_NODE_CPT,
  SAVE_EDITING_NODE_CPT,
} from 'constants/editing-node-cpt';
import reducer from './editing-node-cpt';

describe('EditingNodeCpt Reducers', () => {
  describe('DEFAULT', () => {
    it('returns null', () => {
      expect(reducer(undefined, {})).toBe(null);
    });
  });

  describe('EDITING_NODE_CPT', () => {
    const node = {
      id: 'node-id',
      states: ['True', 'False'],
      cpt: {
        True: 0.5,
        False: 0.5,
      },
      parents: [],
    };

    it('returns node from payload', () => {
      expect(
        reducer(
          undefined,
          {
            type: EDITING_NODE_CPT,
            payload: { node },
          },
        ),
      ).toEqual(node);
    });
  });

  describe('CANCEL_EDITING_NODE_CPT', () => {
    it('returns null', () => {
      expect(
        reducer(
          undefined,
          {
            type: CANCEL_EDITING_NODE_CPT,
          },
        ),
      ).toBe(null);
    });
  });

  describe('SAVE_EDITING_NODE_CPT', () => {
    it('returns null', () => {
      expect(
        reducer(
          undefined,
          {
            type: SAVE_EDITING_NODE_CPT,
          },
        ),
      ).toBe(null);
    });
  });
});
