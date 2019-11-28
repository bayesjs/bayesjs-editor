import { CHANGE_NETWORK_PROPERTY, LOAD_NETWORK, NEW_NETWORK } from 'actions';
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

  describe('CHANGE_NETWORK_PROPERTY', () => {
    describe('When property name is "description"', () => {
      it('returns new value', () => {
        expect(
          reducer(
            'old description',
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'description', value: 'new description' },
            },
          ),
        ).toBe('new description');
      });
    });

    describe('When property name is not "description"', () => {
      it('returns current state value', () => {
        expect(
          reducer(
            'old description',
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'other', value: 'new description' },
            },
          ),
        ).toBe('old description');
      });
    });
  });
});
