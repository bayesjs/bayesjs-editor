import {
  ADD_LINKAGE,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_LINKAGE,
} from '@actions';

import reducer from './linkages';

describe('Linkages Reducer', () => {
  describe('DEFAULT', () => {
    it('returns an empty object', () => {
      expect(reducer(undefined, {})).toEqual({});
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns an empty object', () => {
      expect(reducer(undefined, { type: NEW_NETWORK })).toEqual({});
    });
  });

  describe('ADD_LINKAGE', () => {
    const now = 1530518207007; // current time
    beforeEach(() => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => new Date(now).valueOf());
    });

    it('adds a linkage to state', () => {
      expect(
        reducer(undefined, {
          type: ADD_LINKAGE,
          payload: { linkage: 'linkage' },
        }),
      ).toEqual({ [now]: 'linkage' });
    });
  });

  describe('REMOVE_LINKAGE', () => {
    const now = 1530518207007; // current time
    beforeEach(() => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => new Date(now).valueOf());
    });

    it('removes a linkage of state', () => {
      expect(
        reducer(
          { [now]: 'linkage 1', 1530000000000: 'linkage 2' },
          { type: REMOVE_LINKAGE, payload: { id: now } },
        ),
      ).toEqual({ 1530000000000: 'linkage 2' });
    });
  });

  describe('LOAD_NETWORK', () => {
    describe('When network has linkages', () => {
      const action = {
        type: LOAD_NETWORK,
        payload: {
          state: {
            network: {
              linkages: {
                test: 'test',
              },
            },
          },
        },
      };
      it('returns linkages', () => {
        expect(reducer(undefined, action)).toEqual({ test: 'test' });
      });
    });

    describe('When network is empty', () => {
      const action = {
        type: LOAD_NETWORK,
        payload: {
          state: { network: {} },
        },
      };

      it('returns an empty object', () => {
        expect(reducer(undefined, action)).toEqual({});
      });
    });
  });
});
