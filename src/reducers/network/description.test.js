import {
  LOAD_NETWORK,
  NEW_NETWORK,
  UPDATE_NETWORK_DESCRIPTION,
} from '@actions';

import reducer from './description';

describe('Network Description Reducer', () => {
  describe('DEFAULT', () => {
    it('returns an empty string', () => {
      expect(reducer(undefined, {})).toBe('');
    });
  });

  describe('LOAD_NETWORK', () => {
    describe('When payload network has description', () => {
      const payload = {
        state: {
          network: {
            description: 'description',
          },
        },
      };

      it('returns network description', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe('description');
      });
    });

    describe('When payload network has no description', () => {
      const payload = { state: {} };

      it('returns an empty string', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBe('');
      });
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns an empty string', () => {
      expect(reducer(undefined, { type: NEW_NETWORK })).toBe('');
    });
  });

  describe('UPDATE_NETWORK_DESCRIPTION', () => {
    it('returns new value', () => {
      expect(
        reducer(
          'old description',
          {
            type: UPDATE_NETWORK_DESCRIPTION,
            payload: { description: 'new description' },
          },
        ),
      ).toBe('new description');
    });
  });
});
