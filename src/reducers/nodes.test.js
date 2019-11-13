import SimpleNetwork from 'json-templates/networks/simple.json';
import NetworkChangeStatesInitial from 'json-templates/networks/change-states/initial.json';
import NetworkChangeNodeStatesWithParents from 'json-templates/networks/change-states/node-with-parents.json';
import NetworkChangeNodeStatesWithoutParents from 'json-templates/networks/change-states/node-without-parents.json';
import NetworkChangeCptInitial from 'json-templates/networks/change-cpt/initial.json';
import NetworkChangeNodeCpt from 'json-templates/networks/change-cpt/updated.json';
import NetworkChangeParentsNotConnected from 'json-templates/networks/change-parents/not-connected.json';
import NetworkChangeParentsConnectedWithParents from 'json-templates/networks/change-parents/connected-with-parents.json';
import NetworkChangeParentsConnectedWithoutParents from 'json-templates/networks/change-parents/connected-without-parents.json';
import NetworkChangeIdInitial from 'json-templates/networks/change-id/initial.json';
import NetworkChangeIdUpdated from 'json-templates/networks/change-id/updated.json';
import NetworkRemoveNodeInitial from 'json-templates/networks/remove-node/initial.json';
import NetworkRemoveNodeUpdated from 'json-templates/networks/remove-node/updated.json';
import {
  ADD_NODE,
  ADD_PARENT,
  CHANGE_NODE_DESCRIPTION,
  CHANGE_NODE_ID,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_NODE,
  REMOVE_PARENT,
} from 'actions';
import { SAVE_EDITING_NODE_CPT } from 'constants/editing-node-cpt';
import { SAVE_EDITING_NODE_STATES } from 'constants/editing-node-states';
import reducer from './nodes';

describe('Nodes Reducer', () => {
  const node = {
    id: 'Node 1',
    states: [
      'True',
      'False',
    ],
    parents: [],
    cpt: {
      True: 0.5,
      False: 0.5,
    },
  };

  describe('DEFAULT', () => {
    it('returns an empty array', () => {
      expect(reducer(undefined, {})).toEqual([]);
    });
  });

  describe('NEW_NETWORK', () => {
    it('returns an empty array', () => {
      expect(reducer(undefined, { type: NEW_NETWORK })).toEqual([]);
    });
  });

  describe('LOAD_NETWORK', () => {
    const nodes = [node];

    it('returns nodes from payload state', () => {
      expect(reducer([], {
        type: LOAD_NETWORK,
        payload: { state: { nodes } },
      })).toEqual(nodes);
    });
  });

  describe('ADD_NODE', () => {
    const id = 'Node 2';
    const states = ['True', 'False'];

    it('adds a new node with cpt calculated', () => {
      expect(reducer([node], {
        type: ADD_NODE,
        payload: { id, states },
      })).toEqual([
        node,
        {
          id,
          states,
          parents: [],
          cpt: {
            True: 0.5,
            False: 0.5,
          },
        }]);
    });
  });

  describe('REMOVE_NODE', () => {
    const id = 'Node 1';

    it('removes node an updates cpt and parents from another nodes', () => {
      expect(reducer(NetworkRemoveNodeInitial, {
        type: REMOVE_NODE,
        payload: { id },
      })).toEqual(NetworkRemoveNodeUpdated);
    });
  });

  describe('ADD_PARENT', () => {
    describe('When node and parent are the same node', () => {
      const id = 'Node 3';
      const parentId = 'Node 3';

      it('returns state', () => {
        expect(reducer(NetworkChangeParentsNotConnected, {
          type: ADD_PARENT,
          payload: { id, parentId },
        })).toEqual(NetworkChangeParentsNotConnected);
      });
    });

    describe('When node has already this parent', () => {
      const id = 'Node 3';
      const parentId = 'Node 2';

      it('returns state', () => {
        expect(reducer(NetworkChangeParentsNotConnected, {
          type: ADD_PARENT,
          payload: { id, parentId },
        })).toEqual(NetworkChangeParentsNotConnected);
      });
    });

    describe('When this connection will create a cyclic network', () => {
      const id = 'Node 1';
      const parentId = 'Node 3';

      it('returns state', () => {
        expect(reducer(NetworkChangeParentsNotConnected, {
          type: ADD_PARENT,
          payload: { id, parentId },
        })).toEqual(NetworkChangeParentsNotConnected);
      });
    });

    describe('When connecting with a node with parents', () => {
      const id = 'Node 3';
      const parentId = 'Node 4';

      it('adds node in parents an updates cpt', () => {
        expect(reducer(NetworkChangeParentsNotConnected, {
          type: ADD_PARENT,
          payload: { id, parentId },
        })).toEqual(NetworkChangeParentsConnectedWithParents);
      });
    });

    describe('When connecting with a node without parents', () => {
      const id = 'Node 1';
      const parentId = 'Node 4';

      it('adds node in parents an updates cpt', () => {
        expect(reducer(NetworkChangeParentsNotConnected, {
          type: ADD_PARENT,
          payload: { id, parentId },
        })).toEqual(NetworkChangeParentsConnectedWithoutParents);
      });
    });
  });

  describe('REMOVE_PARENT', () => {
    describe('When removing connection from a node with more than one parent', () => {
      const id = 'Node 3';
      const parentId = 'Node 4';

      it('removes node in parents an updates cpt', () => {
        expect(reducer(NetworkChangeParentsConnectedWithParents, {
          type: REMOVE_PARENT,
          payload: { id, parentId },
        })).toEqual(NetworkChangeParentsNotConnected);
      });
    });

    describe('When removing connection from a node with only one parent', () => {
      const id = 'Node 1';
      const parentId = 'Node 4';

      it('removes node in parents an updates cpt', () => {
        expect(reducer(NetworkChangeParentsConnectedWithoutParents, {
          type: REMOVE_PARENT,
          payload: { id, parentId },
        })).toEqual(NetworkChangeParentsNotConnected);
      });
    });
  });

  describe('CHANGE_NODE_ID', () => {
    const id = 'Node 2';
    const nextId = 'New ID';

    it('changes node id', () => {
      expect(reducer(NetworkChangeIdInitial, {
        type: CHANGE_NODE_ID,
        payload: { id, nextId },
      })).toEqual(NetworkChangeIdUpdated);
    });
  });

  describe('SAVE_EDITING_NODE_CPT', () => {
    describe('When cpt is the same', () => {
      const id = 'Node 1';
      const cpt = {
        True: 0.5,
        False: 0.5,
      };

      it('returns state', () => {
        expect(reducer(NetworkChangeCptInitial, {
          type: SAVE_EDITING_NODE_CPT,
          payload: { id, cpt },
        })).toEqual(NetworkChangeCptInitial);
      });
    });

    describe('When receives a new cpt', () => {
      const id = 'Node 1';
      const cpt = {
        True: 0.2,
        False: 0.8,
      };

      it('updates node cpt', () => {
        expect(reducer(NetworkChangeCptInitial, {
          type: SAVE_EDITING_NODE_CPT,
          payload: { id, cpt },
        })).toEqual(NetworkChangeNodeCpt);
      });
    });
  });

  describe('SAVE_EDITING_NODE_STATES', () => {
    describe('When states are the same', () => {
      const id = 'Node 3';
      const states = ['True', 'False'];

      it('returns state', () => {
        expect(reducer(NetworkChangeStatesInitial, {
          type: SAVE_EDITING_NODE_STATES,
          payload: { id, states },
        })).toEqual(NetworkChangeStatesInitial);
      });
    });

    describe('When node has parents', () => {
      const id = 'Node 3';
      const states = ['True', 'New State'];

      it('updates node states and cpt', () => {
        expect(reducer(NetworkChangeStatesInitial, {
          type: SAVE_EDITING_NODE_STATES,
          payload: { id, states },
        })).toEqual(NetworkChangeNodeStatesWithParents);
      });
    });

    describe('When node has no parents', () => {
      const id = 'Node 1';
      const states = ['True', 'New State'];

      it('updates node states and cpt', () => {
        expect(reducer(NetworkChangeStatesInitial, {
          type: SAVE_EDITING_NODE_STATES,
          payload: { id, states },
        })).toEqual(NetworkChangeNodeStatesWithoutParents);
      });
    });
  });

  describe('CHANGE_NODE_DESCRIPTION', () => {
    const id = 'Node 1';
    const description = 'new description';
    const nodes = [{
      id: 'Node 1',
      states: [
        'True',
        'False',
      ],
      parents: [],
      cpt: {
        True: 0.5,
        False: 0.5,
      },
    },
    {
      id: 'Node 2',
      states: [
        'True',
        'False',
      ],
      parents: [],
      cpt: {
        True: 0.5,
        False: 0.5,
      },
    }];

    it('adds description to node', () => {
      expect(reducer(nodes, {
        type: CHANGE_NODE_DESCRIPTION,
        payload: { id, description },
      })).toEqual([{
        id: 'Node 1',
        states: [
          'True',
          'False',
        ],
        parents: [],
        cpt: {
          True: 0.5,
          False: 0.5,
        },
        description,
      },
      {
        id: 'Node 2',
        states: [
          'True',
          'False',
        ],
        parents: [],
        cpt: {
          True: 0.5,
          False: 0.5,
        },
      }]);
    });
  });
});
