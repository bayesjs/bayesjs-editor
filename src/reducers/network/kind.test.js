import { NEW_NETWORK, LOAD_NETWORK } from 'actions';
import { NETWORK_KINDS } from 'constants/network';
import reducer from './kind';

describe('Network Kind Reducer', () => {
  describe('DEFAULT', () => {
    it('returns BN type', () => {
      expect(reducer(undefined, {})).toBe(NETWORK_KINDS.BN);
    });
  });

  describe('NEW_NETWORK', () => {
    const kind = NETWORK_KINDS.BN;

    it('returns kind', () => {
      expect(reducer(undefined, { type: NEW_NETWORK, kind })).toBe(NETWORK_KINDS.BN);
    });
  });

  describe('LOAD_NETWORK', () => {
    describe('When payload has a network with kind', () => {
      const payload = {
        state: {
          network: {
            kind: NETWORK_KINDS.MSBN,
          },
        },
      };

      it('returns network kind', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe(NETWORK_KINDS.MSBN);
      });
    });

    describe('When payload has a network without kind', () => {
      const payload = {
        state: {},
      };

      it('returns BN type', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe(NETWORK_KINDS.BN);
      });
    });
  });
});
