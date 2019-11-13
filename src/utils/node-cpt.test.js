import SimpleNetwork from 'json-templates/networks/simple.json';
import {
  addNodeParentInCpt,
  createCpt,
  removeNodeParentInCpt,
  updateCptValue,
  updateNodeParentIdInCpt,
  updateNodeParentStatesInCpt,
  updateStatesInCpt,
} from './node-cpt';

describe('Node Cpt Utils', () => {
  describe('updateCptValue', () => {
    describe('When cpt is a object', () => {
      const cpt = {
        T: 0.5,
        F: 0.5,
      };

      it('updates object value', () => {
        expect(updateCptValue(cpt, 0.8, 'T')).toEqual({
          T: 0.8,
          F: 0.5,
        });
      });
    });

    describe('When cpt is an array', () => {
      const cpt = [
        {
          when: {
            Node_father: 'T',
          },
          then: {
            T: 0.5,
            F: 0.5,
          },
        },
        {
          when: {
            Node_father: 'F',
          },
          then: {
            T: 0.5,
            F: 0.5,
          },
        },
      ];

      it('updates array value', () => {
        expect(updateCptValue(cpt, 0.3, 'F', 1)).toEqual([
          {
            when: {
              Node_father: 'T',
            },
            then: {
              T: 0.5,
              F: 0.5,
            },
          },
          {
            when: {
              Node_father: 'F',
            },
            then: {
              T: 0.5,
              F: 0.3,
            },
          },
        ]);
      });
    });
  });

  describe('createCpt', () => {
    describe('When node has two states', () => {
      const states = ['True', 'False'];

      it('returns a object with all keys with the same value', () => {
        expect(createCpt(states)).toEqual({
          True: 0.5,
          False: 0.5,
        });
      });
    });

    describe('When node has three states (floating point)', () => {
      const states = ['State_1', 'State_2', 'State_3'];

      it('returns a object with all keys value truncated and the first one with the missing value', () => {
        expect(createCpt(states)).toEqual({
          State_1: 0.33333334,
          State_2: 0.33333333,
          State_3: 0.33333333,
        });
      });
    });
  });

  describe('addNodeParentInCpt', () => {
    describe('When node has no parents', () => {
      const node = {
        id: 'Node 1',
        parents: [],
        cpt: {
          True: 0.5,
          False: 0.5,
        },
      };
      const nodeParent = {
        id: 'Node 2',
        states: ['True', 'False'],
      };

      it('returns a cpt array', () => {
        expect(addNodeParentInCpt(nodeParent, node)).toEqual([
          {
            then: { False: 0.5, True: 0.5 },
            when: { 'Node 2': 'True' },
          }, {
            then: { False: 0.5, True: 0.5 },
            when: { 'Node 2': 'False' },
          },
        ]);
      });
    });

    describe('When node has parents', () => {
      const node = {
        id: 'Node 3',
        cpt: [
          {
            when: { 'Node 2': 'True', 'Node 1': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'True', 'Node 1': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
        ],
      };
      const nodeParent = {
        id: 'Node 4',
        states: ['True', 'False'],

      };

      it('returns cpt array with news items', () => {
        expect(addNodeParentInCpt(nodeParent, node)).toEqual([
          {
            when: { 'Node 2': 'True', 'Node 1': 'True', 'Node 4': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'True', 'Node 4': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'True', 'Node 1': 'False', 'Node 4': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'False', 'Node 4': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'True', 'Node 1': 'True', 'Node 4': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'True', 'Node 4': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'True', 'Node 1': 'False', 'Node 4': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'False', 'Node 4': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
        ]);
      });
    });
  });

  describe('removeNodeParentInCpt', () => {
    describe('When node doens not have the parent', () => {
      const node = {
        id: 'Node 3',
        parents: [],
        states: ['True', 'False'],
        cpt: { True: 0.5, False: 0.5 },
      };
      const nodeParent = {
        id: 'Node 1',
        parents: [],
        states: ['True', 'False'],
        cpt: { 'State 1': 0.5, 'State 2': 0.5 },
      };

      it('returns cpt', () => {
        expect(removeNodeParentInCpt(nodeParent, node)).toEqual({ True: 0.5, False: 0.5 });
      });
    });

    describe('When node has only this parent', () => {
      const nodeParent = {
        id: 'Node 4',
      };
      const node = {
        parents: ['Node 4'],
        cpt: [
          {
            when: { 'Node 4': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 4': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
        ],
      };

      it('returns the first "then" as cpt', () => {
        expect(removeNodeParentInCpt(nodeParent, node)).toEqual({
          True: 0.5,
          False: 0.5,
        });
      });
    });

    describe('When node has not only this parent', () => {
      const nodeParent = {
        id: 'Node 4',
        states: ['True', 'False'],
      };
      const node = {
        parents: ['Node 1', 'Node 2', 'Node 4'],
        cpt: [
          {
            when: { 'Node 2': 'True', 'Node 1': 'True', 'Node 4': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'True', 'Node 4': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'True', 'Node 1': 'False', 'Node 4': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'False', 'Node 4': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'True', 'Node 1': 'True', 'Node 4': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'True', 'Node 4': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'True', 'Node 1': 'False', 'Node 4': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'False', 'Node 4': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
        ],
      };

      it('removes parent node from "when"', () => {
        expect(removeNodeParentInCpt(nodeParent, node)).toEqual([
          {
            when: { 'Node 2': 'True', 'Node 1': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'True', 'Node 1': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
        ]);
      });
    });
  });

  describe('updateStatesInCpt', () => {
    describe('When node has no parents', () => {
      const node = {
        id: 'Node 1',
        states: [
          'True',
          'False',
        ],
        parents: [],
        cpt: {
          State_1: 0.25,
          State_2: 0.25,
          State_3: 0.25,
          State_4: 0.25,
        },
      };

      describe('and is adding a new state', () => {
        const states = ['State_1', 'State_2', 'State_3', 'State_4', 'State_5'];

        it('adds new state with zero as value', () => {
          expect(updateStatesInCpt(states, node)).toEqual({
            State_1: 0.25,
            State_2: 0.25,
            State_3: 0.25,
            State_4: 0.25,
            State_5: 0,
          });
        });
      });

      describe('and is removing a state', () => {
        const states = ['State_1', 'State_2'];

        it('removes the states and balance the cpt values', () => {
          expect(updateStatesInCpt(states, node)).toEqual({
            State_1: 0.5,
            State_2: 0.5,
          });
        });
      });

      describe('and is adding and removing states', () => {
        const states = ['State_1', 'State_2', 'State_3', 'State_New'];

        it('removes/adds the states and adds the removed value in new states', () => {
          expect(updateStatesInCpt(states, node)).toEqual({
            State_1: 0.25,
            State_2: 0.25,
            State_3: 0.25,
            State_New: 0.25,
          });
        });
      });
    });

    describe('When node has parents', () => {
      const node = {
        id: 'Node 3',
        states: ['True', 'False'],
        parents: ['Node 2', 'Node 1'],
        cpt: [
          {
            when: { 'Node 2': 'True', 'Node 1': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'True', 'Node 1': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 2': 'False', 'Node 1': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
        ],
      };

      describe('and is adding a new state', () => {
        const states = ['True', 'False', 'New State'];

        it('adds new state with zero as value', () => {
          expect(updateStatesInCpt(states, node)).toEqual([
            {
              when: { 'Node 1': 'True', 'Node 2': 'True' },
              then: { 'New State': 0, True: 0.5, False: 0.5 },
            },
            {
              when: { 'Node 1': 'True', 'Node 2': 'False' },
              then: { 'New State': 0, True: 0.5, False: 0.5 },
            },
            {
              when: { 'Node 1': 'False', 'Node 2': 'True' },
              then: { 'New State': 0, True: 0.5, False: 0.5 },
            },
            {
              when: { 'Node 1': 'False', 'Node 2': 'False' },
              then: { 'New State': 0, True: 0.5, False: 0.5 },
            },
          ]);
        });
      });

      describe('and is removing a state', () => {
        const states = ['True'];

        it('removes the state and balance the cpt values', () => {
          expect(updateStatesInCpt(states, node)).toEqual([
            {
              when: { 'Node 1': 'True', 'Node 2': 'True' },
              then: { True: 1 },
            },
            {
              when: { 'Node 1': 'True', 'Node 2': 'False' },
              then: { True: 1 },
            },
            {
              when: { 'Node 1': 'False', 'Node 2': 'True' },
              then: { True: 1 },
            },
            {
              when: { 'Node 1': 'False', 'Node 2': 'False' },
              then: { True: 1 },
            },
          ]);
        });
      });

      describe('and is adding and removing states', () => {
        const states = ['True', 'New State'];

        it('removes/adds the states and adds the removed value in new states', () => {
          expect(updateStatesInCpt(states, node)).toEqual([
            {
              when: { 'Node 1': 'True', 'Node 2': 'True' },
              then: { 'New State': 0.5, True: 0.5 },
            },
            {
              when: { 'Node 1': 'True', 'Node 2': 'False' },
              then: { 'New State': 0.5, True: 0.5 },
            },
            {
              when: { 'Node 1': 'False', 'Node 2': 'True' },
              then: { 'New State': 0.5, True: 0.5 },
            },
            {
              when: { 'Node 1': 'False', 'Node 2': 'False' },
              then: { 'New State': 0.5, True: 0.5 },
            },
          ]);
        });
      });
    });
  });

  describe('updateNodeParentIdInCpt', () => {
    const id = 'Node 2';
    const nextId = 'New ID';
    const node = {
      id: 'Node 3',
      cpt: [
        {
          when: { 'Node 2': 'True', 'Node 1': 'True' },
          then: { True: 0.5, False: 0.5 },
        },
        {
          when: { 'Node 2': 'False', 'Node 1': 'True' },
          then: { True: 0.5, False: 0.5 },
        },
        {
          when: { 'Node 2': 'True', 'Node 1': 'False' },
          then: { True: 0.5, False: 0.5 },
        },
        {
          when: { 'Node 2': 'False', 'Node 1': 'False' },
          then: { True: 0.5, False: 0.5 },
        },
      ],
    };

    it('updates "when" with new id', () => {
      expect(updateNodeParentIdInCpt(id, nextId, node)).toEqual([
        {
          when: { 'New ID': 'True', 'Node 1': 'True' },
          then: { True: 0.5, False: 0.5 },
        },
        {
          when: { 'New ID': 'False', 'Node 1': 'True' },
          then: { True: 0.5, False: 0.5 },
        },
        {
          when: { 'New ID': 'True', 'Node 1': 'False' },
          then: { True: 0.5, False: 0.5 },
        },
        {
          when: { 'New ID': 'False', 'Node 1': 'False' },
          then: { True: 0.5, False: 0.5 },
        },
      ]);
    });
  });

  describe('updateNodeParentStatesInCpt', () => {
    const parentId = 'Node 1';
    const node = {
      id: 'Node 3',
      states: ['True', 'False'],
      parents: ['Node 2', 'Node 1'],
      cpt: [
        {
          when: { 'Node 1': 'True', 'Node 2': 'True' },
          then: { True: 0.5, False: 0.5 },
        },
        {
          when: { 'Node 1': 'True', 'Node 2': 'False' },
          then: { True: 0.5, False: 0.5 },
        },
        {
          when: { 'Node 1': 'False', 'Node 2': 'True' },
          then: { True: 0.5, False: 0.5 },
        },
        {
          when: { 'Node 1': 'False', 'Node 2': 'False' },
          then: { True: 0.5, False: 0.5 },
        },
      ],
    };

    describe('When is adding a new state', () => {
      const nextStates = ['True', 'False', 'New State'];

      it('adds new cpt item with new states', () => {
        expect(updateNodeParentStatesInCpt(parentId, nextStates, SimpleNetwork, node)).toEqual([
          {
            when: { 'Node 1': 'True', 'Node 2': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 1': 'True', 'Node 2': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 1': 'False', 'Node 2': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 1': 'False', 'Node 2': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 1': 'New State', 'Node 2': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 1': 'New State', 'Node 2': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
        ]);
      });
    });

    describe('When is removing a state', () => {
      const nextStates = ['True'];

      it('removes cpt items with removed states', () => {
        expect(updateNodeParentStatesInCpt(parentId, nextStates, SimpleNetwork, node)).toEqual([
          {
            when: { 'Node 1': 'True', 'Node 2': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 1': 'True', 'Node 2': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
        ]);
      });
    });

    describe('When is adding and removing states', () => {
      const nextStates = ['True', 'New State'];

      it('removes/adds cpt items', () => {
        expect(updateNodeParentStatesInCpt(parentId, nextStates, SimpleNetwork, node)).toEqual([
          {
            when: { 'Node 1': 'True', 'Node 2': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 1': 'True', 'Node 2': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 1': 'New State', 'Node 2': 'True' },
            then: { True: 0.5, False: 0.5 },
          },
          {
            when: { 'Node 1': 'New State', 'Node 2': 'False' },
            then: { True: 0.5, False: 0.5 },
          },
        ]);
      });
    });
  });
});
