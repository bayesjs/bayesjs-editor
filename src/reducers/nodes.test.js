import SimpleNetwork from 'json-templates/networks/simple-network.json';
import SimpleNetworkWithNewNodeId from 'json-templates/networks/simple-network-with-new-node-id.json';
import NetworkWith4NodesUnlinked from 'json-templates/networks/simple-network-with-new-node-unlinked.json';
import NetworkWith4NodesLinkedParent from 'json-templates/networks/simple-network-with-new-node-linked-parent.json';
import NetworkWith4NodesLinkedParentless from 'json-templates/networks/simple-network-with-new-node-linked-parentless.json';
import NetworkWithNewStatesParent from 'json-templates/networks/simple-network-with-new-states-parent.json';
import NetworkWithNewStatesParentless from 'json-templates/networks/simple-network-with-new-states-parentless.json';
import NetworkWithNewCpt from 'json-templates/networks/simple-network-with-new-cpt.json';
import SimpleNetworkWithoutNode1 from 'json-templates/networks/simple-network-without-node-1.json';
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
import { clone } from 'ramda'; // some reducers are mutating :'(
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
      expect(reducer(SimpleNetwork, {
        type: REMOVE_NODE,
        payload: { id, nodes: SimpleNetwork },
      })).toEqual(SimpleNetworkWithoutNode1);
    });
  });

  describe('ADD_PARENT', () => {
    describe('When node and parent are the same node', () => {
      const id = 'Node 3';
      const parentId = 'Node 3';

      it('returns state', () => {
        expect(reducer(SimpleNetwork, {
          type: ADD_PARENT,
          payload: { id, parentId, nodes: SimpleNetwork },
        })).toEqual(SimpleNetwork);
      });
    });

    describe('When node has already this parent', () => {
      const id = 'Node 3';
      const parentId = 'Node 2';

      it('returns state', () => {
        expect(reducer(SimpleNetwork, {
          type: ADD_PARENT,
          payload: { id, parentId, nodes: SimpleNetwork },
        })).toEqual(SimpleNetwork);
      });
    });

    describe('When this connection will create a cyclic network', () => {
      const id = 'Node 1';
      const parentId = 'Node 3';

      it('returns state', () => {
        expect(reducer(SimpleNetwork, {
          type: ADD_PARENT,
          payload: { id, parentId, nodes: SimpleNetwork },
        })).toEqual(SimpleNetwork);
      });
    });

    describe('When connecting with a node with parents', () => {
      const id = 'Node 3';
      const parentId = 'Node 4';

      it('adds node in parents an updates cpt', () => {
        expect(reducer(NetworkWith4NodesUnlinked, {
          type: ADD_PARENT,
          payload: { id, parentId, nodes: NetworkWith4NodesUnlinked },
        })).toEqual(NetworkWith4NodesLinkedParent);
      });
    });

    describe('When connecting with a node without parents', () => {
      const id = 'Node 1';
      const parentId = 'Node 4';

      it('adds node in parents an updates cpt', () => {
        expect(reducer(NetworkWith4NodesUnlinked, {
          type: ADD_PARENT,
          payload: { id, parentId, nodes: NetworkWith4NodesUnlinked },
        })).toEqual(NetworkWith4NodesLinkedParentless);
      });
    });
  });

  describe('REMOVE_PARENT', () => {
    describe('When removing connection with a node with parents', () => {
      const id = 'Node 3';
      const parentId = 'Node 4';

      it('removes node in parents an updates cpt', () => {
        expect(reducer(NetworkWith4NodesLinkedParent, {
          type: REMOVE_PARENT,
          payload: { id, parentId, nodes: NetworkWith4NodesLinkedParent },
        })).toEqual(NetworkWith4NodesUnlinked);
      });
    });

    describe('When removing connection with a node without parents', () => {
      const id = 'Node 1';
      const parentId = 'Node 4';

      it('removes node in parents an updates cpt', () => {
        expect(reducer(NetworkWith4NodesLinkedParentless, {
          type: REMOVE_PARENT,
          payload: { id, parentId, nodes: NetworkWith4NodesLinkedParentless },
        })).toEqual(NetworkWith4NodesUnlinked);
      });
    });
  });

  describe('CHANGE_NODE_ID', () => {
    const id = 'Node 2';
    const nextId = 'New ID';

    it('changes node id', () => {
      expect(reducer(SimpleNetwork, {
        type: CHANGE_NODE_ID,
        payload: { id, nextId },
      })).toEqual(SimpleNetworkWithNewNodeId);
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
        expect(reducer(SimpleNetwork, {
          type: SAVE_EDITING_NODE_CPT,
          payload: { id, cpt },
        })).toEqual(SimpleNetwork);
      });
    });

    describe('When receives a new cpt', () => {
      const id = 'Node 1';
      const cpt = {
        True: 0.2,
        False: 0.8,
      };

      it('updates node cpt', () => {
        expect(reducer(SimpleNetwork, {
          type: SAVE_EDITING_NODE_CPT,
          payload: { id, cpt },
        })).toEqual(NetworkWithNewCpt);
      });
    });
  });

  describe('SAVE_EDITING_NODE_STATES', () => {
    describe('When states are the same', () => {
      const id = 'Node 3';
      const states = ['True', 'False'];

      it('returns state', () => {
        expect(reducer(SimpleNetwork, {
          type: SAVE_EDITING_NODE_STATES,
          payload: { id, states, nodes: clone(SimpleNetwork) },
        })).toEqual(SimpleNetwork);
      });
    });

    describe('When node has parents', () => {
      const id = 'Node 3';
      const states = ['True', 'New State'];

      it('updates node states and cpt', () => {
        expect(reducer(SimpleNetwork, {
          type: SAVE_EDITING_NODE_STATES,
          payload: { id, states, nodes: clone(SimpleNetwork) },
        })).toEqual(NetworkWithNewStatesParent);
      });
    });

    describe('When node has no parents', () => {
      const id = 'Node 1';
      const states = ['True', 'New State'];

      it('updates node states and cpt', () => {
        expect(reducer(SimpleNetwork, {
          type: SAVE_EDITING_NODE_STATES,
          payload: { id, states, nodes: clone(SimpleNetwork) },
        })).toEqual(NetworkWithNewStatesParentless);
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
