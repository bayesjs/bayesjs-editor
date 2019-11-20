import SimpleNetwork from 'json-templates/networks/simple.json';
import CyclicNetwork from 'json-templates/networks/cyclic.json';
import { hasCycles, hasCycleAddingNodeParent } from './network';

describe('Network Utils', () => {
  describe('hasCycles', () => {
    describe('When network has cycles', () => {
      it('returns truthy', () => {
        expect(hasCycles(CyclicNetwork)).toBeTruthy();
      });
    });

    describe('When network has not cycles', () => {
      it('returns falsy', () => {
        expect(hasCycles(SimpleNetwork)).toBeFalsy();
      });
    });
  });

  describe('hasCycleAddingNodeParent', () => {
    describe('When connecting two nodes will create a cyclic network', () => {
      const parentId = 'Node 3';
      const nodeId = 'Node 1';

      it('returns truthy', () => {
        expect(hasCycleAddingNodeParent(parentId, nodeId, SimpleNetwork)).toBeTruthy();
      });
    });

    describe('When connecting two nodes will not create a cyclic network', () => {
      const parentId = 'Node 2';
      const nodeId = 'Node 1';

      it('returns falsy', () => {
        expect(hasCycleAddingNodeParent(parentId, nodeId, SimpleNetwork)).toBeFalsy();
      });
    });
  });
});
