import {
  LOAD_NETWORK,
  NEW_NETWORK,
  UPDATE_NETWORK_INFERENCE_ENABLED,
} from '@actions';

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

  describe('UPDATE_NETWORK_INFERENCE_ENABLED', () => {
    it('returns new value', () => {
      expect(
        reducer(
          false,
          {
            type: UPDATE_NETWORK_INFERENCE_ENABLED,
            payload: { inferenceEnabled: true },
          },
        ),
      ).toBeTruthy();
    });
  });
});
