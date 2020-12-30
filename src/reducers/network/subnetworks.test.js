import {
  ADD_SUPER_NODE,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_SUPER_NODE,
  SET_BELIEF,
} from '@actions';

import InitialSubnetworksMsbnAddBelief from '@json-templates/subnetworks/add-belief/msbn/initial.json';
import InitialSubnetworksMsbnChangeBelief from '@json-templates/subnetworks/change-belief/msbn/initial.json';
import InitialSubnetworksMsbnRemoveBelief from '@json-templates/subnetworks/remove-belief/msbn/initial.json';
import UpdatedSubnetworksMsbnAddBelief from '@json-templates/subnetworks/add-belief/msbn/updated.json';
import UpdatedSubnetworksMsbnChangeBelief from '@json-templates/subnetworks/change-belief/msbn/updated.json';
import UpdatedSubnetworksMsbnRemoveBelief from '@json-templates/subnetworks/remove-belief/msbn/updated.json';
import reducer from './subnetworks';

jest.mock('@utils/colors', () => ({
  getRandomColor: () => '#FFFF00',
}));

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
      it('returns an empty array', () => {
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
      it('adds network on state', () => {
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

  describe('SET_BELIEF', () => {
    describe('When adding a new belief', () => {
      const subnetworkId = '2bab2504-4557-4394-a247-72d71d80d03d';

      it('sets beliefs prop', () => {
        expect(
          reducer(
            InitialSubnetworksMsbnAddBelief,
            {
              type: SET_BELIEF,
              payload: { nodeId: 'Node 1', state: 'True', subnetworkId },
            },
          ),
        ).toEqual(UpdatedSubnetworksMsbnAddBelief);
      });
    });

    describe('When changing a belief', () => {
      const subnetworkId = '2bab2504-4557-4394-a247-72d71d80d03d';

      it('sets beliefs prop', () => {
        expect(
          reducer(
            InitialSubnetworksMsbnChangeBelief,
            {
              type: SET_BELIEF,
              payload: { nodeId: 'Node 1', state: 'False', subnetworkId },
            },
          ),
        ).toEqual(UpdatedSubnetworksMsbnChangeBelief);
      });
    });

    describe('When removing a belief', () => {
      const subnetworkId = '2bab2504-4557-4394-a247-72d71d80d03d';

      it('sets beliefs prop', () => {
        expect(
          reducer(
            InitialSubnetworksMsbnRemoveBelief,
            {
              type: SET_BELIEF,
              payload: { nodeId: 'Node 1', state: null, subnetworkId },
            },
          ),
        ).toEqual(UpdatedSubnetworksMsbnRemoveBelief);
      });
    });
  });
});
