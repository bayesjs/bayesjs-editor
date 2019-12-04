import { LOAD_NETWORK, NEW_NETWORK } from 'actions';
import reducer from './id';

describe('Network Id Reducer', () => {
  describe('DEFAULT', () => {
    it('returns an empty string', () => {
      expect(reducer(undefined, {})).toBe('');
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns a new UUID', () => {
      expect(reducer(undefined, { type: NEW_NETWORK })).toBe('9314dbfe-d3ba-48c2-8948-0555806dc4d0');
    });
  });

  describe('LOAD_NETWORK', () => {
    describe('When payload has a network with id', () => {
      const payload = {
        state: {
          network: {
            id: 'network id',
          },
        },
      };

      it('returns network id', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe('network id');
      });
    });

    describe('When payload has a network without id', () => {
      const payload = {
        state: {},
      };

      it('returns a new UUID', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe('9314dbfe-d3ba-48c2-8948-0555806dc4d0');
      });
    });
  });
});
