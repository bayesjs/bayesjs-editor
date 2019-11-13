import {
  containsParentInNode,
  hasConnections,
  hasDescription,
  hasStates,
  isNodeCptValid,
  isNodeWithoutParents,
} from './node';

describe('Node Validations', () => {
  describe('hasConnections', () => {
    describe('Returns "true"', () => {
      it('when has "linkedNode" prop with a object', () => {
        expect(hasConnections({ linkedNode: {} })).toBeTruthy();
      });
    });

    describe('Returns "false"', () => {
      it('when has "linkedNode" prop with an array', () => {
        expect(hasConnections({ linkedNode: [] })).toBeFalsy();
      });

      it('when has "linkedNode" prop with a number', () => {
        expect(hasConnections({ linkedNode: 0 })).toBeFalsy();
      });

      it('when has "linkedNode" prop with null', () => {
        expect(hasConnections({ linkedNode: null })).toBeFalsy();
      });

      it('when has "linkedNode" prop with undefined', () => {
        expect(hasConnections({ linkedNode: undefined })).toBeFalsy();
      });

      it('when has not "linkedNode" prop', () => {
        expect(hasConnections({})).toBeFalsy();
      });
    });
  });

  describe('hasDescription', () => {
    const description = 'description';
    const showDescription = true;

    describe('Returns "true"', () => {
      it('when "description" prop is a non empty string and "showDescription" prop is "true"', () => {
        expect(hasDescription({ description, showDescription })).toBeTruthy();
      });
    });

    describe('Returns "false"', () => {
      it('when "description" prop is empty and "showDescription" prop is "true"', () => {
        expect(hasDescription({ description: '', showDescription })).toBeFalsy();
      });

      it('when "description" prop is non empty and "showDescription" prop is "false"', () => {
        expect(hasDescription({ description, showDescription: false })).toBeFalsy();
      });

      it('when "description" prop is non empty and has no "showDescription" prop', () => {
        expect(hasDescription({ description })).toBeFalsy();
      });

      it('when has not "description" prop and "showDescription" prop is "true"', () => {
        expect(hasDescription({ showDescription })).toBeFalsy();
      });

      it('when has not "description" prop and no "showDescription" prop', () => {
        expect(hasDescription({})).toBeFalsy();
      });
    });
  });

  describe('hasStates', () => {
    describe('Returns "true"', () => {
      it('when has "states" prop with an array', () => {
        expect(hasStates({ states: [] })).toBeTruthy();
      });
    });

    describe('Returns "false"', () => {
      it('when has "states" prop with a object', () => {
        expect(hasStates({ states: {} })).toBeFalsy();
      });

      it('when has "states" prop with a number', () => {
        expect(hasStates({ states: 0 })).toBeFalsy();
      });

      it('when has "states" prop with null', () => {
        expect(hasStates({ states: null })).toBeFalsy();
      });

      it('when has "states" prop with undefined', () => {
        expect(hasStates({ states: undefined })).toBeFalsy();
      });

      it('when has not "states" prop', () => {
        expect(hasStates({})).toBeFalsy();
      });
    });
  });

  describe('isNodeCptValid', () => {
    describe('When cpt is a object', () => {
      describe('and sum is equals to one', () => {
        const cpt = {
          T: 0.5,
          F: 0.5,
        };

        it('returns truthy', () => {
          expect(isNodeCptValid(cpt)).toBeTruthy();
        });

        describe('and contains floating point in the sum', () => {
          it('returns truthy', () => {
            expect(isNodeCptValid({
              State1: 0.6,
              State2: 0.3,
              State3: 0.1,
            })).toBeTruthy();
          });
        });
      });

      describe('and sum is not equals to one', () => {
        const cpt = {
          T: 0.5,
          F: 0.49,
        };

        it('returns falsy', () => {
          expect(isNodeCptValid(cpt)).toBeFalsy();
        });
      });
    });

    describe('When cpt is an array', () => {
      describe('and sum of each "then" is equals to one', () => {
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

        it('returns truthy', () => {
          expect(isNodeCptValid(cpt)).toBeTruthy();
        });
      });

      describe('and sum of one "then" is not equals to one', () => {
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
              F: 0.49,
            },
          },
        ];

        it('returns falsy', () => {
          expect(isNodeCptValid(cpt)).toBeFalsy();
        });
      });
    });
  });

  describe('isNodeWithoutParents', () => {
    describe('When node has no parents', () => {
      const node = {
        parents: [],
      };

      it('returns truthy', () => {
        expect(isNodeWithoutParents(node)).toBeTruthy();
      });
    });

    describe('When node has parents', () => {
      const node = {
        parents: ['True', 'False'],
      };

      it('returns falsy', () => {
        expect(isNodeWithoutParents(node)).toBeFalsy();
      });
    });
  });

  describe('containsParentInNode', () => {
    describe('When node has no parents', () => {
      const parentId = 'Node 2';
      const node = {
        id: 'Node 1',
        parents: [],
      };

      it('returns falsy', () => {
        expect(containsParentInNode(parentId, node)).toBeFalsy();
      });
    });

    describe('When parent is not in node parents', () => {
      const parentId = 'Node 2';
      const node = {
        id: 'Node 1',
        parents: ['Node 3', 'Node 4'],
      };

      it('returns falsy', () => {
        expect(containsParentInNode(parentId, node)).toBeFalsy();
      });
    });

    describe('When parent is in node parents', () => {
      const parentId = 'Node 2';
      const node = {
        id: 'Node 1',
        parents: ['Node 2', 'Node 3'],
      };

      it('returns truthy', () => {
        expect(containsParentInNode(parentId, node)).toBeTruthy();
      });
    });
  });
});
