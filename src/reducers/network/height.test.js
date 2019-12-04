import { CHANGE_NETWORK_PROPERTY, LOAD_NETWORK, NEW_NETWORK } from 'actions';
import reducer from './height';

describe('Network Height Reducer', () => {
  describe('DEFAULT', () => {
    it('returns 500', () => {
      expect(reducer(undefined, {})).toBe(500);
    });
  });

  describe('LOAD_NETWORK', () => {
    describe('When payload network has height', () => {
      const payload = {
        state: {
          network: {
            height: 1000,
          },
        },
      };

      it('returns network height', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe(1000);
      });
    });

    describe('When payload network has no height', () => {
      const payload = { state: {} };

      it('returns 500', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe(500);
      });
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns an empty string', () => {
      expect(reducer(undefined, { type: NEW_NETWORK })).toBe(500);
    });
  });

  describe('CHANGE_NETWORK_PROPERTY', () => {
    describe('When property name is "height"', () => {
      it('returns new value', () => {
        expect(
          reducer(
            500,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'height', value: 800 },
            },
          ),
        ).toBe(800);
      });
    });

    describe('When property name is not "height"', () => {
      it('returns current state value', () => {
        expect(
          reducer(
            500,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'other', value: 800 },
            },
          ),
        ).toBe(500);
      });
    });
  });
});
