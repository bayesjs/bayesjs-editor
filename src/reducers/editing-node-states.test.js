import {
  EDITING_NODE_STATES,
  CANCEL_EDITING_NODE_STATES,
  SAVE_EDITING_NODE_STATES,
} from 'constants/editing-node-states';
import reducer from './editing-node-states';

describe('EditingNodeStates Reducers', () => {
  describe('DEFAULT', () => {
    it('returns null', () => {
      expect(reducer(undefined, {})).toBeNull();
    });
  });

  describe('EDITING_NODE_STATES', () => {
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
            type: EDITING_NODE_STATES,
            payload: { node },
          },
        ),
      ).toEqual(node);
    });
  });

  describe('CANCEL_EDITING_NODE_STATES', () => {
    it('returns null', () => {
      expect(
        reducer(
          undefined,
          {
            type: CANCEL_EDITING_NODE_STATES,
          },
        ),
      ).toBeNull();
    });
  });

  describe('SAVE_EDITING_NODE_STATES', () => {
    it('returns null', () => {
      expect(
        reducer(
          undefined,
          {
            type: SAVE_EDITING_NODE_STATES,
          },
        ),
      ).toBeNull();
    });
  });
});
