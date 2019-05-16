import { range } from 'ramda';
import {
  getNodeConnectionsHeight,
  getNodeConnectionsOffset,
  getNodeDescriptionHeight,
  getNodeHeaderHeight,
  getNodeHeight,
  getNodeSize,
  getNodeStateHeight,
  getNodeStatesOffset,
  getNodeWidth,
} from './node-size';


const createNode = (props = {}) => ({
  id: 'ID',
  parents: [],
  ...props,
});

const withDescription = { showDescription: true, description: 'description' };
const withTwoStates = { states: range(0, 1) };
const withThreeStates = { states: range(0, 2) };
const withFourStates = { states: range(0, 3) };
const withConnections = { linkedNode: { connections: [] } };

describe('Arrows Positions Utils', () => {
  describe('getNodeHeight', () => {
    it('returns 40 when has description', () => {
      const node = createNode({
        ...withDescription,
      });

      expect(getNodeHeight(node)).toBe(40);
    });

    describe('When has two states', () => {
      const node = createNode({
        ...withTwoStates,
      });

      it('returns 42', () => {
        expect(getNodeHeight(node)).toBe(42);
      });

      it('and has connections returns 62', () => {
        expect(getNodeHeight({
          ...node,
          ...withConnections,
        })).toBe(62);
      });
    });

    describe('When has three states', () => {
      const node = createNode({
        ...withThreeStates,
      });

      it('returns 61', () => {
        expect(getNodeHeight(node)).toBe(61);
      });

      it('and has connections returns 81', () => {
        expect(getNodeHeight({
          ...node,
          ...withConnections,
        })).toBe(81);
      });
    });

    describe('When has four states', () => {
      const node = createNode({
        ...withFourStates,
      });

      it('returns 80', () => {
        expect(getNodeHeight(node)).toBe(80);
      });

      it('and has connections returns 100', () => {
        expect(getNodeHeight({
          ...node,
          ...withConnections,
        })).toBe(100);
      });
    });
  });

  describe('getNodeWidth', () => {
    it('always returns 160', () => {
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

  describe('getNodeConnectionsHeight', () => {
    it('always returns 20', () => {
      expect(getNodeConnectionsHeight()).toBe(20);
    });
  });

  describe('getNodeConnectionsOffset', () => {
    it('when has two states returns 42', () => {
      const node = createNode({
        ...withTwoStates,
      });

      expect(getNodeConnectionsOffset(node)).toBe(42);
    });

    it('when has three states returns 61', () => {
      const node = createNode({
        ...withThreeStates,
      });

      expect(getNodeConnectionsOffset(node)).toBe(61);
    });

    it('when has four states returns 80', () => {
      const node = createNode({
        ...withFourStates,
      });

      expect(getNodeConnectionsOffset(node)).toBe(80);
    });
  });

  describe('getNodeDescriptionHeight', () => {
    it('always returns 20', () => {
      expect(getNodeDescriptionHeight()).toBe(20);
    });
  });

  describe('getNodeHeaderHeight', () => {
    it('always returns 20', () => {
      expect(getNodeHeaderHeight()).toBe(20);
    });
  });

  describe('getNodeStateHeight', () => {
    it('always returns 16', () => {
      expect(getNodeStateHeight()).toBe(16);
    });
  });

  describe('getNodeStatesOffset', () => {
    it('when index is "0" returns 23', () => {
      const node = createNode();
      const index = 0;

      expect(getNodeStatesOffset(node, index)).toBe(23);
    });

    it('when index is "1" returns 42', () => {
      const node = createNode();
      const index = 1;

      expect(getNodeStatesOffset(node, index)).toBe(42);
    });

    it('when index is "2" returns 61', () => {
      const node = createNode();
      const index = 2;

      expect(getNodeStatesOffset(node, index)).toBe(61);
    });
  });
});
