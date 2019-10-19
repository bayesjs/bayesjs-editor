import { NETWORK_KINDS } from 'constants/network';
import {
  persistState,
  newNetwork,
  loadNetwork,
  PERSIST_STATE,
  NEW_NETWORK,
  LOAD_NETWORK,
} from './index';

const persistStateAction = {
  type: PERSIST_STATE,
};

describe('Actions', () => {
  let dispatch;

  beforeAll(() => {
    dispatch = jest.fn();
  });

  beforeEach(() => {
    dispatch.mockClear();
  });

  describe('persistState', () => {
    let actionResult;

    beforeEach(() => {
      actionResult = persistState();
    });

    it('calls dispatch with type PERSIST_STATE', () => {
      expect(actionResult).toEqual(persistStateAction);
    });
  });

  describe('newNetwork', () => {
    describe('When passing no kind parameter', () => {
      beforeEach(() => {
        newNetwork()(dispatch);
      });

      it('calls dispatch with type NEW_NETWORK and kind BN', () => {
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: NEW_NETWORK,
          kind: NETWORK_KINDS.BN,
        });
      });

      it('calls dispatch persist action', () => {
        expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
      });
    });

    describe('When passing with kind parameter as MSBN', () => {
      beforeEach(() => {
        newNetwork(NETWORK_KINDS.MSBN)(dispatch);
      });

      it('calls dispatch with type NEW_NETWORK and kind BN', () => {
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: NEW_NETWORK,
          kind: NETWORK_KINDS.MSBN,
        });
      });

      it('calls dispatch persist action', () => {
        expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
      });
    });
  });

  describe('loadNetwork', () => {
    const state = { key: 'value' };

    beforeEach(() => {
      loadNetwork(state)(dispatch);
    });

    it('calls dispatch with type LOAD_NETWORK and payload with state', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: LOAD_NETWORK,
        payload: { state },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });
});
