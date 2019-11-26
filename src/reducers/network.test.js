import InitialNetworkMsbnAddBelief from 'json-templates/networks/add-belief/msbn/initial.json';
import InitialNetworkMsbnChangeBelief from 'json-templates/networks/change-belief/msbn/initial.json';
import InitialNetworkMsbnRemoveBelief from 'json-templates/networks/remove-belief/msbn/initial.json';
import InitialStateLoadNetworkBn from 'json-templates/state/load-network/bn/initial.json';
import InitialStateLoadNetworkBnLegacy from 'json-templates/state/load-network/bn/legacy/initial.json';
import InitialStateLoadNetworkMsbn from 'json-templates/state/load-network/msbn/initial.json';
import UpdatedNetworkMsbnAddBelief from 'json-templates/networks/add-belief/msbn/updated.json';
import UpdatedNetworkMsbnChangeBelief from 'json-templates/networks/change-belief/msbn/updated.json';
import UpdatedNetworkMsbnRemoveBelief from 'json-templates/networks/remove-belief/msbn/updated.json';
import UpdatedStateLoadNetworkBn from 'json-templates/state/load-network/bn/updated.json';
import UpdatedStateLoadNetworkBnLegacy from 'json-templates/state/load-network/bn/legacy/updated.json';
import UpdatedStateLoadNetworkMsbn from 'json-templates/state/load-network/msbn/updated.json';

import {
  CHANGE_NETWORK_PROPERTY,
  CHANGE_NODE_ID,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_NODE,
  SET_BELIEF,
} from 'actions';
import { NETWORK_KINDS } from 'constants/network';
import reducer from './network';

const id = '9314dbfe-d3ba-48c2-8948-0555806dc4d0';
const newEmptyBNNetwork = {
  id,
  name: 'Rede Bayesiana',
  height: 500,
  width: 800,
  selectedNodes: [],
  beliefs: {},
  propertiesPanelVisible: true,
  kind: NETWORK_KINDS.BN,
  nodes: [],
  positions: {},
  subnetworks: [],
  linkages: {},
};

const newEmptyMSBNNetwork = {
  id,
  name: 'Rede Bayesiana',
  height: 500,
  width: 800,
  selectedNodes: [],
  beliefs: {},
  propertiesPanelVisible: true,
  kind: NETWORK_KINDS.MSBN,
  nodes: [],
  positions: {},
  subnetworks: [],
  linkages: {},
};

describe('EditingNodeCpt Reducers', () => {
  describe('DEFAULT', () => {
    it('returns null', () => {
      expect(reducer(undefined, {})).toEqual({
        id: '',
        name: 'Rede Bayesiana',
        height: 500,
        width: 800,
        selectedNodes: [],
        beliefs: {},
        propertiesPanelVisible: true,
        kind: NETWORK_KINDS.BN,
        nodes: [],
        positions: [],
        subnetworks: [],
        linkages: {},
      });
    });
  });

  describe('NEW_NETWORK', () => {
    describe('When kind is BN', () => {
      it('returns a new empty BN newtwork', () => {
        expect(
          reducer(
            undefined,
            {
              type: NEW_NETWORK,
              kind: NETWORK_KINDS.BN,
            },
          ),
        ).toEqual(newEmptyBNNetwork);
      });
    });

    describe('When kind is MSBN', () => {
      it('returns a new empty MSBN newtwork', () => {
        expect(
          reducer(
            undefined,
            {
              type: NEW_NETWORK,
              kind: NETWORK_KINDS.MSBN,
            },
          ),
        ).toEqual(newEmptyMSBNNetwork);
      });
    });
  });

  describe('LOAD_NETWORK', () => {
    describe('When kind is BN', () => {
      it('returns new network state', () => {
        expect(
          reducer(
            undefined,
            {
              type: LOAD_NETWORK,
              payload: InitialStateLoadNetworkBn,
            },
          ),
        ).toEqual(UpdatedStateLoadNetworkBn);
      });

      describe('and is legacy', () => {
        it('returns new network state', () => {
          expect(
            reducer(
              undefined,
              {
                type: LOAD_NETWORK,
                payload: InitialStateLoadNetworkBnLegacy,
              },
            ),
          ).toEqual(UpdatedStateLoadNetworkBnLegacy);
        });
      });
    });

    describe('When kind is MSBN', () => {
      it('returns new network state', () => {
        expect(
          reducer(
            undefined,
            {
              type: LOAD_NETWORK,
              payload: InitialStateLoadNetworkMsbn,
            },
          ),
        ).toEqual(UpdatedStateLoadNetworkMsbn);
      });
    });
  });

  describe('CHANGE_NETWORK_PROPERTY', () => {
    describe('When changes "selectedNodes"', () => {
      const value = ['Node 1'];

      it('sets the value into selectedNodes prop', () => {
        expect(
          reducer(
            newEmptyBNNetwork,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'selectedNodes', value },
            },
          ),
        ).toEqual({
          ...newEmptyBNNetwork,
          selectedNodes: value,
        });
      });
    });

    describe('When changes "propertiesPanelVisible"', () => {
      const value = false;

      it('sets the value into propertiesPanelVisible prop', () => {
        expect(
          reducer(
            newEmptyBNNetwork,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'propertiesPanelVisible', value },
            },
          ),
        ).toEqual({
          ...newEmptyBNNetwork,
          propertiesPanelVisible: value,
        });
      });
    });

    describe('When changes "name"', () => {
      const value = 'new name';

      it('sets the value into name prop', () => {
        expect(
          reducer(
            newEmptyBNNetwork,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'name', value },
            },
          ),
        ).toEqual({
          ...newEmptyBNNetwork,
          name: value,
        });
      });
    });

    describe('When changes "description"', () => {
      const value = 'my description';

      it('sets the value into description prop', () => {
        expect(
          reducer(
            newEmptyBNNetwork,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'description', value },
            },
          ),
        ).toEqual({
          ...newEmptyBNNetwork,
          description: value,
        });
      });
    });

    describe('When changes "height"', () => {
      const value = 1000;

      it('sets the value into height prop', () => {
        expect(
          reducer(
            newEmptyBNNetwork,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'height', value },
            },
          ),
        ).toEqual({
          ...newEmptyBNNetwork,
          height: value,
        });
      });
    });

    describe('When changes "width"', () => {
      const value = 1000;

      it('sets the value into width prop', () => {
        expect(
          reducer(
            newEmptyBNNetwork,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'width', value },
            },
          ),
        ).toEqual({
          ...newEmptyBNNetwork,
          width: value,
        });
      });
    });

    describe('When changes "inferenceEnabled"', () => {
      const value = false;

      it('sets the value into inferenceEnabled prop', () => {
        expect(
          reducer(
            newEmptyBNNetwork,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'inferenceEnabled', value },
            },
          ),
        ).toEqual({
          ...newEmptyBNNetwork,
          inferenceEnabled: value,
        });
      });
    });
  });

  describe('REMOVE_NODE', () => {
    it('deselects all nodes', () => {
      expect(
        reducer(
          { ...newEmptyBNNetwork, selectedNodes: ['Node 1'] },
          {
            type: REMOVE_NODE,
            payload: {},
          },
        ),
      ).toEqual({
        ...newEmptyBNNetwork,
        selectedNodes: [],
      });
    });
  });

  describe('CHANGE_NODE_ID', () => {
    it('updates selectedNodes name', () => {
      expect(
        reducer(
          { ...newEmptyBNNetwork, selectedNodes: ['Node 1', 'Node 2'] },
          {
            type: CHANGE_NODE_ID,
            payload: { id: 'Node 1', nextId: 'Node 10' },
          },
        ),
      ).toEqual({
        ...newEmptyBNNetwork,
        selectedNodes: ['Node 10', 'Node 2'],
      });
    });
  });

  describe('SET_BELIEF', () => {
    describe('When adding a new belief', () => {
      describe('When kind is BN', () => {
        it('sets beliefs prop', () => {
          expect(
            reducer(
              newEmptyBNNetwork,
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: 'True', subnetworkId: null },
              },
            ),
          ).toEqual({
            ...newEmptyBNNetwork,
            beliefs: { 'Node 1': 'True' },
          });
        });
      });

      describe('When kind is MSBN', () => {
        const subnetworkId = '2bab2504-4557-4394-a247-72d71d80d03d';

        it('sets beliefs prop', () => {
          expect(
            reducer(
              InitialNetworkMsbnAddBelief,
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: 'True', subnetworkId },
              },
            ),
          ).toEqual(UpdatedNetworkMsbnAddBelief);
        });
      });
    });

    describe('When changing a belief', () => {
      describe('When kind is BN', () => {
        const network = {
          ...newEmptyBNNetwork,
          beliefs: { 'Node 1': 'True' },
        };

        it('sets beliefs prop', () => {
          expect(
            reducer(
              network,
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: 'False', subnetworkId: null },
              },
            ),
          ).toEqual({
            ...network,
            beliefs: { 'Node 1': 'False' },
          });
        });
      });

      describe('When kind is MSBN', () => {
        const subnetworkId = '2bab2504-4557-4394-a247-72d71d80d03d';

        it('sets beliefs prop', () => {
          expect(
            reducer(
              InitialNetworkMsbnChangeBelief,
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: 'False', subnetworkId },
              },
            ),
          ).toEqual(UpdatedNetworkMsbnChangeBelief);
        });
      });
    });

    describe('When removing a belief', () => {
      describe('When kind is BN', () => {
        const network = {
          ...newEmptyBNNetwork,
          beliefs: { 'Node 1': 'True' },
        };

        it('sets beliefs prop', () => {
          expect(
            reducer(
              network,
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: null, subnetworkId: null },
              },
            ),
          ).toEqual({
            ...network,
            beliefs: {},
          });
        });
      });

      describe('When kind is MSBN', () => {
        const subnetworkId = '2bab2504-4557-4394-a247-72d71d80d03d';

        it('sets beliefs prop', () => {
          expect(
            reducer(
              InitialNetworkMsbnRemoveBelief,
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: null, subnetworkId },
              },
            ),
          ).toEqual(UpdatedNetworkMsbnRemoveBelief);
        });
      });
    });
  });
});
