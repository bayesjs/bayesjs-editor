import { LOAD_NETWORK, NEW_NETWORK, SET_BELIEF } from '@actions';

import reducer from './beliefs';

describe('Network Beliefs Reducer', () => {
  describe('DEFAULT', () => {
    it('returns an empty object', () => {
      expect(reducer(undefined, {})).toEqual({});
    });
  });

  describe('LOAD_NETWORK', () => {
    it('returns an empty object', () => {
      expect(reducer(undefined, { type: LOAD_NETWORK })).toEqual({});
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns an empty object', () => {
      expect(reducer(undefined, { type: NEW_NETWORK })).toEqual({});
    });
  });

  describe('SET_BELIEF', () => {
    describe('When adding a new belief', () => {
      describe('When kind is BN', () => {
        it('sets beliefs prop', () => {
          expect(
            reducer(
              {},
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: 'True', subnetworkId: null },
              },
            ),
          ).toEqual({ 'Node 1': 'True' });
        });
      });

      describe('When kind is MSBN', () => {
        const subnetworkId = '2bab2504-4557-4394-a247-72d71d80d03d';

        it('sets beliefs prop', () => {
          expect(
            reducer(
              {},
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: 'True', subnetworkId },
              },
            ),
          ).toEqual({
            [subnetworkId]: { 'Node 1': 'True' },
          });
        });
      });
    });

    describe('When changing a belief', () => {
      describe('When kind is BN', () => {
        const beliefs = { 'Node 1': 'True' };

        it('sets beliefs prop', () => {
          expect(
            reducer(
              beliefs,
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: 'False', subnetworkId: null },
              },
            ),
          ).toEqual({ 'Node 1': 'False' });
        });
      });

      describe('When kind is MSBN', () => {
        const subnetworkId = '2bab2504-4557-4394-a247-72d71d80d03d';
        const beliefs = {
          [subnetworkId]: { 'Node 1': 'True' },
        };

        it('sets beliefs prop', () => {
          expect(
            reducer(
              beliefs,
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: 'False', subnetworkId },
              },
            ),
          ).toEqual({
            [subnetworkId]: { 'Node 1': 'False' },
          });
        });
      });
    });

    describe('When removing a belief', () => {
      describe('When kind is BN', () => {
        const beliefs = { 'Node 1': 'True' };

        it('sets beliefs prop', () => {
          expect(
            reducer(
              beliefs,
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: null, subnetworkId: null },
              },
            ),
          ).toEqual({});
        });
      });

      describe('When kind is MSBN', () => {
        const subnetworkId = '2bab2504-4557-4394-a247-72d71d80d03d';
        const beliefs = {
          [subnetworkId]: { 'Node 1': 'True' },
        };

        it('sets beliefs prop', () => {
          expect(
            reducer(
              beliefs,
              {
                type: SET_BELIEF,
                payload: { nodeId: 'Node 1', state: null, subnetworkId },
              },
            ),
          ).toEqual({
            [subnetworkId]: {},
          });
        });
      });
    });
  });
});
