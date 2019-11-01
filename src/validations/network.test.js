import SimpleNetwork from 'json-templates/networks/simple.json';
import CyclicNetwork from 'json-templates/networks/cyclic.json';
import { hasCycles } from './network';

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
});
