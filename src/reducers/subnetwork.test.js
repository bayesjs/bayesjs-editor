import {
  ADD_SUPER_NODE,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_SUPER_NODE,
} from 'actions';

import reducer from './subnetwork';

describe('Subnetwork Reducers', () => {
  describe('DEFAULT', () => {
    it('returns an empty array', () => {
      expect(reducer(undefined, {})).toEqual([]);
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns an empty array', () => {
      expect(reducer(undefined, {
        type: NEW_NETWORK,
      })).toEqual([]);
    });
  });

  describe('LOAD_NETWORK', () => {
    it('returns subnetworks from action payload', () => {
      const subnetworks = [1, 2, 3];
      const action = {
        type: LOAD_NETWORK,
        payload: {
          state: {
            network: { subnetworks },
          },
        },
      };

      expect(reducer(undefined, action)).toEqual(subnetworks);
    });

    it('returns empty array if action payload has no subnetwork', () => {
      const action = {
        type: LOAD_NETWORK,
        payload: {
          state: {
            network: {},
          },
        },
      };

      expect(reducer(undefined, action)).toEqual([]);
    });
  });

  describe('ADD_SUPER_NODE', () => {
    it('returns state with added super node', () => {
      const state = [
        { id: 1 },
      ];

      const nodes = [1, 2, 3];
      const positions = [1, 2, 3];

      const action = {
        type: ADD_SUPER_NODE,
        payload: {
          state: {
            network: { id: 2 },
            nodes,
            positions,
          },
        },
      };

      expect(reducer(state, action)).toEqual([
        { id: 1 },
        {
          id: 2, nodes, positions, color: '#FFFF00',
        },
      ]);
    });

    it('returns state with added network when payload has network only', () => {
      const state = [
        { id: 1 },
      ];

      const action = {
        type: ADD_SUPER_NODE,
        payload: {
          state: {
            network: { id: 2 },
          },
        },
      };

      expect(reducer(state, action)).toEqual([
        { id: 1 },
        { id: 2 },
      ]);
    });

    it('returns new state when payload has state only', () => {
      const state = [
        { id: 1 },
      ];

      const action = {
        type: ADD_SUPER_NODE,
        payload: {
          state: {},
        },
      };

      expect(reducer(state, action)).toEqual([
        { id: 1 }, undefined,
      ]);
    });
  });

  describe('REMOVE_SUPER_NODE', () => {
    it('returns subnetworks without specified subnetwork', () => {
      const state = [
        { id: 1 },
      ];
      const action = {
        type: REMOVE_SUPER_NODE,
        payload: {
          id: 1,
        },
      };

      expect(reducer(state, action)).toEqual([]);
    });

    it('returns state when payload has specified non-exists subnetwork', () => {
      const state = [
        { id: 2 },
      ];
      const action = {
        type: REMOVE_SUPER_NODE,
        payload: {
          id: 1,
        },
      };
      expect(reducer(state, action)).toEqual(state);
    });
  });
});
