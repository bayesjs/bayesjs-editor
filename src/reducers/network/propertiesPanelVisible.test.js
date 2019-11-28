import { CHANGE_NETWORK_PROPERTY, LOAD_NETWORK, NEW_NETWORK } from 'actions';
import reducer from './propertiesPanelVisible';

describe('Network PropertiesPanelVisible Reducer', () => {
  describe('DEFAULT', () => {
    it('returns truthy', () => {
      expect(reducer(undefined, {})).toBeTruthy();
    });
  });

  describe('LOAD_NETWORK', () => {
    describe('When payload network has propertiesPanelVisible', () => {
      const payload = {
        state: {
          network: {
            propertiesPanelVisible: false,
          },
        },
      };

      it('returns network propertiesPanelVisible', () => {
        expect(reducer(undefined, { type: LOAD_NETWORK, payload })).toBeFalsy();
      });
    });

    describe('When payload network has no propertiesPanelVisible', () => {
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
    describe('When property name is "propertiesPanelVisible"', () => {
      it('returns new value', () => {
        expect(
          reducer(
            true,
            {
              type: CHANGE_NETWORK_PROPERTY,
              payload: { name: 'propertiesPanelVisible', value: false },
            },
          ),
        ).toBeFalsy();
      });
    });

    describe('When property name is not "propertiesPanelVisible"', () => {
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
