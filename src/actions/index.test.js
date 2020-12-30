import {
  ADD_LINKAGE,
  ADD_NODE,
  ADD_PARENT,
  ADD_SUPER_NODE,
  CHANGE_NODE_DESCRIPTION,
  CHANGE_NODE_ID,
  CHANGE_NODE_POSITION,
  LOAD_NETWORK,
  NEW_NETWORK,
  PERSIST_STATE,
  REMOVE_LINKAGE,
  REMOVE_NODE,
  REMOVE_PARENT,
  REMOVE_SUPER_NODE,
  SET_BELIEF,
  addLinkage,
  addNode,
  addParent,
  addSuperNode,
  changeNodeDescription,
  changeNodeId,
  changeNodePosition,
  loadNetwork,
  newNetwork,
  persistState,
  removeLinkage,
  removeNode,
  removeParent,
  removeSuperNode,
  setBelief,
} from './index';

import { NETWORK_KINDS } from '@constants/network';

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

  describe('setBelief', () => {
    const nodeId = 42;
    const state = { key: 'value' };
    const subnetworkId = 43;

    beforeEach(() => {
      setBelief(nodeId, state, subnetworkId)(dispatch);
    });

    it('calls dispatch with type SET_BELIEF and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: SET_BELIEF,
        payload: { nodeId, state, subnetworkId },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('changeNodeId', () => {
    const id = 42;
    const nextId = 43;

    beforeEach(() => {
      changeNodeId(id, nextId)(dispatch);
    });

    it('calls dispatch with type CHANGE_NODE_ID and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: CHANGE_NODE_ID,
        payload: { id, nextId },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('changeNodeDescription', () => {
    const id = 42;
    const description = 'lorem ipsum';

    beforeEach(() => {
      changeNodeDescription(id, description)(dispatch);
    });

    it('calls dispatch with type CHANGE_NODE_DESCRIPTION and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: CHANGE_NODE_DESCRIPTION,
        payload: { id, description },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('changeNodePosition', () => {
    const id = 42;
    const x = 0;
    const y = 0;

    beforeEach(() => {
      changeNodePosition(id, x, y)(dispatch);
    });

    it('calls dispatch with type CHANGE_NODE_POSITION and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: CHANGE_NODE_POSITION,
        payload: { id, x, y },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });


  describe('addNode', () => {
    const id = 42;
    const states = ['fake-statuses'];
    const position = 42;

    beforeEach(() => {
      addNode(id, states, position)(dispatch);
    });

    it('calls dispatch with type ADD_NODE and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: ADD_NODE,
        payload: { id, states, position },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('addSuperNode', () => {
    const id = 42;
    const name = 'name';
    const position = 42;

    describe('When the network has id', () => {
      const state = {
        network: { id },
      };

      beforeEach(() => {
        addSuperNode(state, position)(dispatch);
      });

      it('calls dispatch with type ADD_SUPER_NODE and payload with network id', () => {
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ADD_SUPER_NODE,
          payload: { id, state, position },
        });
      });

      it('calls dispatch persist action', () => {
        expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
      });
    });

    describe('When the network has not id', () => {
      const state = {
        network: { name },
      };

      beforeEach(() => {
        addSuperNode(state, position)(dispatch);
      });

      it('calls dispatch with type ADD_SUPER_NODE and payload with network name as id', () => {
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ADD_SUPER_NODE,
          payload: { id: name, state, position },
        });
      });

      it('calls dispatch persist action', () => {
        expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
      });
    });
  });

  describe('removeSuperNode', () => {
    const id = 42;

    beforeEach(() => {
      removeSuperNode(id)(dispatch);
    });

    it('calls dispatch with type REMOVE_SUPER_NODE and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: REMOVE_SUPER_NODE,
        payload: { id },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('addLinkage', () => {
    const linkage = { key: 'value' };

    beforeEach(() => {
      addLinkage(linkage)(dispatch);
    });

    it('calls dispatch with type ADD_LINKAGE and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: ADD_LINKAGE,
        payload: { linkage },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });


  describe('removeLinkage', () => {
    const id = 42;

    beforeEach(() => {
      removeLinkage(id)(dispatch);
    });

    it('calls dispatch with type REMOVE_LINKAGE and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: REMOVE_LINKAGE,
        payload: { id },
      });
    });

    it('calls dispatch persist action', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('removeNode', () => {
    const id = 42;

    beforeEach(() => {
      removeNode(id)(dispatch);
    });

    it('calls dispatch with type REMOVE_NODE and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: REMOVE_NODE,
        payload: { id },
      });
    });

    it('calls dispatch persist actions', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('addParent', () => {
    const id = 42;
    const parentId = 21;

    beforeEach(() => {
      addParent(id, parentId)(dispatch);
    });

    it('calls dispatch with type ADD_PARENT and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: ADD_PARENT,
        payload: { id, parentId },
      });
    });

    it('calls dispatch persist actions', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });

  describe('removeParent', () => {
    const id = 42;
    const parentId = 21;

    beforeEach(() => {
      removeParent(id, parentId)(dispatch);
    });

    it('calls dispatch with type REMOVE_PARENT and payload', () => {
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: REMOVE_PARENT,
        payload: { id, parentId },
      });
    });

    it('calls dispatch persist actions', () => {
      expect(dispatch).toHaveBeenNthCalledWith(2, persistStateAction);
    });
  });
});
