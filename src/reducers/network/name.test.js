import { CHANGE_NETWORK_PROPERTY, LOAD_NETWORK, NEW_NETWORK } from 'actions';
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

  describe('CHANGE_NETWORK_PROPERTY', () => {
    describe('When property name is "name"', () => {
      it('returns new value', () => {
        expect(
          reducer(
            'old name',
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'name', value: 'new name' },
            },
          ),
        ).toBe('new name');
      });
    });

    describe('When property name is not "name"', () => {
      it('returns current state value', () => {
        expect(
          reducer(
            'old name',
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'other', value: 'new name' },
            },
          ),
        ).toBe('old name');
      });
    });
  });
});
