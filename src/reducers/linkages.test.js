import {
  ADD_LINKAGE,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_LINKAGE,
} from 'actions';

import reducer from './linkages';

describe('Linkages Reducer', () => {
  describe('DEFAULT', () => {
    it('Should return a empty object', () => {
      expect(reducer(undefined, {})).toEqual({});
    });
  });

  describe('NEW_NETWORK', () => {
    it('Should return a empty object', () => {
      expect(reducer(undefined, { type: NEW_NETWORK })).toEqual({});
    });
  });
  describe('ADD_LINKAGE', () => {
    it('Should add a linkage to state', () => {
      const now = 1530518207007;
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => new Date(now).valueOf());
      const action = {
        type: ADD_LINKAGE,
        payload: { linkage: 'linkage' },
      };
      expect(reducer(undefined, action)).toEqual({ [now]: 'linkage' });
    });
  });
  describe('REMOVE_LINKAGE', () => {
    it('Should remove a linkage of state', () => {
      const now = 1530518207007;
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => new Date(now).valueOf());
      const addAction = {
        type: ADD_LINKAGE,
        payload: { linkage: 'linkage' },
      };
      const removeAction = {
        type: REMOVE_LINKAGE,
        payload: { id: now },
      };
      expect(reducer(undefined, addAction)).toEqual({ [now]: 'linkage' });
      expect(reducer(undefined, removeAction)).toEqual({});
    });
  });

  describe('LOAD_NETWORK', () => {
    it('Should return linkages', () => {
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
      expect(reducer(undefined, action)).toEqual({ test: 'test' });
    });

    it('Should return a empty object', () => {
      const action = {
        type: LOAD_NETWORK,
        payload: {
          state: { network: {} },
        },
      };
      expect(reducer(undefined, action)).toEqual({});
    });
  });
});
