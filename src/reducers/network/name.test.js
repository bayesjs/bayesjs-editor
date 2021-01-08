import {
  LOAD_NETWORK,
  NEW_NETWORK,
  UPDATE_NETWORK_NAME,
} from '@actions';

import reducer from './name';

describe('Network Name Reducer', () => {
  describe('DEFAULT', () => {
    it('returns "Rede Bayesiana"', () => {
      expect(reducer(undefined, {})).toBe('Rede Bayesiana');
    });
  });

  describe('LOAD_NETWORK', () => {
    describe('When payload network has name', () => {
      const payload = {
        state: {
          network: {
            name: 'New name',
          },
        },
      };

      it('returns network name', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe('New name');
      });
    });

    describe('When payload network has no name', () => {
      const payload = { state: {} };

      it('returns "Rede Bayesiana"', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe('Rede Bayesiana');
      });
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns "Rede Bayesiana"', () => {
      expect(reducer(undefined, { type: NEW_NETWORK })).toBe('Rede Bayesiana');
    });
  });

  describe('UPDATE_NETWORK_NAME', () => {
    it('returns new value', () => {
      expect(
        reducer(
          'old name',
          {
            type: UPDATE_NETWORK_NAME,
            payload: { name: 'new name' },
          },
        ),
      ).toBe('new name');
    });
  });
});
