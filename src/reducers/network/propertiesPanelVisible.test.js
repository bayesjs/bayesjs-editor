import {
  UPDATE_NETWORK_PROPERTIES_PANEL_VISIBLE,
  LOAD_NETWORK,
  NEW_NETWORK,
} from 'actions';

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

  describe('UPDAUPDATE_NETWORK_PROPERTIES_PANEL_VISIBLET', () => {
    it('returns new value', () => {
      expect(
        reducer(
          true,
          {
            type: UPDATE_NETWORK_PROPERTIES_PANEL_VISIBLE,
            payload: { propertiesPanelVisible: false },
          },
        ),
      ).toBeFalsy();
    });
  });
});
