import { range } from 'ramda';
import { getNodeHeight, getNodeWidth, getNodeSize } from './node-size';
import { NETWORK_KINDS } from '../actions';

const createNode = (props = {}) => ({
  id: 'ID',
  parents: [],
  ...props,
});

describe('Arrows Positions Utils', () => {
  describe('getNodeHeight', () => {
    describe('When is a bayesian node', () => {
      it('and has one states returns 43', () => {
        const node = createNode({
          states: range(0, 1),
        });
        expect(getNodeHeight(node)).toBe(43);
      });

      it('and has two states returns 61', () => {
        const node = createNode({
          states: range(0, 2),
        });
        expect(getNodeHeight(node)).toBe(61);
      });

      it('and has three states returns 79', () => {
        const node = createNode({
          states: range(0, 3),
        });
        expect(getNodeHeight(node)).toBe(79);
      });
    });

    describe('When is a multiply sectioned bayesian node', () => {
      it('and has three states returns 43', () => {
        const node = createNode({
          kind: NETWORK_KINDS.BN,
        });

        expect(getNodeHeight(node)).toBe(43);
      });
    });

    describe('When is a network from a multiply sectioned bayesian', () => {
      it('and has three states returns 59', () => {
        const node = createNode({
          link: 'some value',
        });

        expect(getNodeHeight(node)).toBe(59);
      });
    });
  });

  describe('getNodeWidth', () => {
    it('always return 160', () => {
      expect(getNodeWidth()).toBe(160);
    });
  });

  describe('getNodeSize', () => {
    let result;

    beforeAll(() => {
      const node = createNode();
      result = getNodeSize(node);
    });

    it('has "width" prop', () => {
      expect(result.width).toBeTruthy();
    });

    it('has "height" prop', () => {
      expect(result.height).toBeTruthy();
    });
  });
});
