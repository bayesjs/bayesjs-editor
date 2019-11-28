import { CHANGE_NETWORK_PROPERTY, LOAD_NETWORK, NEW_NETWORK } from 'actions';
import reducer from './inferenceEnabled';

describe('Network InferenceEnabled Reducer', () => {
  describe('DEFAULT', () => {
    it('returns truthy', () => {
      expect(reducer(undefined, {})).toBeTruthy();
    });
  });

  describe('LOAD_NETWORK', () => {
    describe('When payload network has inferenceEnabled', () => {
      const payload = {
        state: {
          network: {
            inferenceEnabled: false,
          },
        },
      };

      it('returns network inferenceEnabled', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBeFalsy();
      });
    });

    describe('When payload network has no inferenceEnabled', () => {
      const payload = { state: {} };

      it('returns truthy', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBeTruthy();
      });
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns truthy', () => {
      expect(reducer(undefined, { type: NEW_NETWORK })).toBeTruthy();
    });
  });

  describe('CHANGE_NETWORK_PROPERTY', () => {
    describe('When property name is "inferenceEnabled"', () => {
      it('returns new value', () => {
        expect(
          reducer(
            true,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'inferenceEnabled', value: false },
            },
          ),
        ).toBeFalsy();
      });
    });

    describe('When property name is not "inferenceEnabled"', () => {
      it('returns current state value', () => {
        expect(
          reducer(
            true,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'other', value: false },
            },
          ),
        ).toBeTruthy();
      });
    });
  });
});
