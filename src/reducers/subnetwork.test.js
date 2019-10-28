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
    describe('When action has a network with subnetworks', () => {
      it('returns subnetworks', () => {
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
    });

    describe('When action has a network without subnetworks', () => {
      it('returns empty array', () => {
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
  });

  describe('ADD_SUPER_NODE', () => {
    const state = [
      { id: 1 },
    ];

    describe('When action has a network with nodes and positions', () => {
      it('adds network, nodes and positions on state', () => {
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
    });

    describe('When action has a network without nodes and positions', () => {
      it('adss network on state', () => {
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
    });

    describe('When action has not network', () => {
      it('adds undefined on state', () => {
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
  });

  describe('REMOVE_SUPER_NODE', () => {
    const state = [
      { id: 1 },
      { id: 2 },
    ];

    describe('When action has a valid subnetwork id', () => {
      it('removes subnetwork from state', () => {
        const action = {
          type: REMOVE_SUPER_NODE,
          payload: {
            id: 1,
          },
        };

        expect(reducer(state, action)).toEqual([
          { id: 2 },
        ]);
      });
    });

    describe('When action has a not valid subnetwork id', () => {
      it('returns state', () => {
        const action = {
          type: REMOVE_SUPER_NODE,
          payload: {
            id: 123,
          },
        };
        expect(reducer(state, action)).toEqual([
          { id: 1 },
          { id: 2 },
        ]);
      });
    });
  });
});
