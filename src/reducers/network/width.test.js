import { CHANGE_NETWORK_PROPERTY, LOAD_NETWORK, NEW_NETWORK } from 'actions';
import reducer from './width';

describe('Network Width Reducer', () => {
  describe('DEFAULT', () => {
    it('returns 800', () => {
      expect(reducer(undefined, {})).toBe(800);
    });
  });

  describe('LOAD_NETWORK', () => {
    describe('When payload network has width', () => {
      const payload = {
        state: {
          network: {
            width: 1000,
          },
        },
      };

      it('returns network width', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe(1000);
      });
    });

    describe('When payload network has no width', () => {
      const payload = { state: {} };

      it('returns 800', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe(800);
      });
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns an empty string', () => {
      expect(reducer(undefined, { type: NEW_NETWORK })).toBe(800);
    });
  });

  describe('CHANGE_NETWORK_PROPERTY', () => {
    describe('When property name is "width"', () => {
      it('returns new value', () => {
        expect(
          reducer(
            800,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'width', value: 1000 },
            },
          ),
        ).toBe(1000);
      });
    });

    describe('When property name is not "width"', () => {
      it('returns current state value', () => {
        expect(
          reducer(
            800,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'other', value: 1000 },
            },
          ),
        ).toBe(800);
      });
    });
  });
});
