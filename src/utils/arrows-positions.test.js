import { map, pipe } from 'ramda';

import { getArrowsPositions, getArrowsPositionsForMSBN, makeArrowLine } from './arrows-positions';

const TYPE_LEFT = 'left';
const TYPE_RIGHT = 'right';
const TYPE_TOP = 'top';
const TYPE_BOTTOM = 'bottom';

const RAIN_NODE = 'RAIN';
const SPRINKLER_NODE = 'SPRINKLER';
const GRASS_WET_NODE = 'GRASS_WET';

const NETWORK_1 = 'NETWORK_1';
const NETWORK_2 = 'NETWORK_2';
const NETWORK_3 = 'NETWORK_3';
const NETWORK_4 = 'NETWORK_4';

const SIZES = { width: 160, height: 160 };

const mapPostions = (positions = {}) => map(node => ({
  ...node,
  position: positions[node.id],
}));

const mapSize = map(node => ({
  ...node,
  size: SIZES,
}));

const createSprinklerNetworkWithPostionsAndStates = (positions) => {
  const rain = {
    id: RAIN_NODE,
    parents: [],
  };

  const sprinkler = {
    id: SPRINKLER_NODE,
    parents: ['RAIN'],
  };

  const grassWet = {
    id: GRASS_WET_NODE,
    parents: ['RAIN', 'SPRINKLER'],
  };

  return pipe(mapPostions(positions), mapSize)([rain, sprinkler, grassWet]);
};

const createNetworksWithPostions = (positions = {}) => {
  const net1 = {
    id: NETWORK_1,
  };
  const net2 = {
    id: NETWORK_2,
  };
  const net3 = {
    id: NETWORK_3,
  };
  const net4 = {
    id: NETWORK_4,
  };

  return pipe(mapPostions(positions), mapSize)([net1, net2, net3, net4]);
};

describe('Arrows Positions Utils', () => {
  describe('getArrowsPositions', () => {
    const markEnd = true;

    it('When positions are RAIN_NODE { x: 1, y: 200 }, SPRINKLER_NODE: { x: 550, y: 100 } and GRASS_WET_NODE: { x: 200, y: 490 }', () => {
      const positions = {
        [RAIN_NODE]: { x: 1, y: 200 },
        [SPRINKLER_NODE]: { x: 550, y: 100 },
        [GRASS_WET_NODE]: { x: 200, y: 490 },
      };
      const network = createSprinklerNetworkWithPostionsAndStates(positions);

      expect(getArrowsPositions(network)).toEqual([
        {
          childId: SPRINKLER_NODE,
          from: { type: TYPE_RIGHT, x: 161, y: 280 },
          key: `${RAIN_NODE}-${SPRINKLER_NODE}`,
          markEnd,
          parentId: RAIN_NODE,
          to: { type: TYPE_LEFT, x: 550, y: 180 },
        }, {
          childId: GRASS_WET_NODE,
          from: { type: TYPE_BOTTOM, x: 81, y: 360 },
          key: `${RAIN_NODE}-${GRASS_WET_NODE}`,
          markEnd,
          parentId: RAIN_NODE,
          to: { type: TYPE_TOP, x: 280, y: 490 },
        }, {
          childId: GRASS_WET_NODE,
          from: { type: TYPE_BOTTOM, x: 630, y: 260 },
          key: `${SPRINKLER_NODE}-${GRASS_WET_NODE}`,
          markEnd,
          parentId: SPRINKLER_NODE,
          to: { type: TYPE_RIGHT, x: 360, y: 570 },
        },
      ]);
    });

    it('When positions are RAIN_NODE { x: 100, y: 45 }, SPRINKLER_NODE: { x: 1, y: 250 } and GRASS_WET_NODE: { x: 50, y: 100 }', () => {
      const positions = {
        [RAIN_NODE]: { x: 100, y: 45 },
        [SPRINKLER_NODE]: { x: 1, y: 250 },
        [GRASS_WET_NODE]: { x: 50, y: 100 },
      };
      const network = createSprinklerNetworkWithPostionsAndStates(positions);

      expect(getArrowsPositions(network)).toEqual([
        {
          childId: SPRINKLER_NODE,
          from: { type: TYPE_BOTTOM, x: 180, y: 205 },
          key: `${RAIN_NODE}-${SPRINKLER_NODE}`,
          markEnd,
          parentId: RAIN_NODE,
          to: { type: TYPE_TOP, x: 81, y: 250 },
        }, {
          childId: GRASS_WET_NODE,
          from: { type: TYPE_BOTTOM, x: 180, y: 205 },
          key: `${RAIN_NODE}-${GRASS_WET_NODE}`,
          markEnd,
          parentId: RAIN_NODE,
          to: { type: TYPE_RIGHT, x: 210, y: 180 },
        }, {
          childId: GRASS_WET_NODE,
          from: { type: TYPE_TOP, x: 81, y: 250 },
          key: `${SPRINKLER_NODE}-${GRASS_WET_NODE}`,
          markEnd,
          parentId: SPRINKLER_NODE,
          to: { type: TYPE_BOTTOM, x: 130, y: 260 },
        },
      ]);
    });
  });

  describe('getArrowsPositionsForMSBN', () => {
    const markEnd = false;
    const linkagesByTwoNode = [
      { networkId1: NETWORK_2, networkId2: NETWORK_1 },
      { networkId1: NETWORK_3, networkId2: NETWORK_1 },
      { networkId1: NETWORK_4, networkId2: NETWORK_1 },
    ];

    it('When positions are NETWORK_1 { x: 314, y: 224.5 }, NETWORK_2 { x: 326, y: 64.5 }, NETWORK_3 { x: 64, y: 220.5 }, NETWORK_4 { x: 574, y: 216.5 }', () => {
      const positions = {
        [NETWORK_1]: { x: 314, y: 224.5 },
        [NETWORK_2]: { x: 326, y: 64.5 },
        [NETWORK_3]: { x: 64, y: 220.5 },
        [NETWORK_4]: { x: 574, y: 216.5 },
      };
      const networks = createNetworksWithPostions(positions);

      expect(getArrowsPositionsForMSBN(networks, linkagesByTwoNode)).toEqual([{
        networkId1: NETWORK_2,
        networkId2: NETWORK_1,
        from: { type: TYPE_BOTTOM, x: 406, y: 224.5 },
        key: 'NETWORK_2-NETWORK_1',
        markEnd,
        to: { type: TYPE_TOP, x: 394, y: 224.5 },
      }, {
        networkId1: NETWORK_3,
        networkId2: NETWORK_1,
        from: { type: TYPE_RIGHT, x: 224, y: 300.5 },
        key: 'NETWORK_3-NETWORK_1',
        markEnd,
        to: { type: TYPE_LEFT, x: 314, y: 304.5 },
      }, {
        networkId1: NETWORK_4,
        networkId2: NETWORK_1,
        from: { type: TYPE_LEFT, x: 574, y: 296.5 },
        key: 'NETWORK_4-NETWORK_1',
        markEnd,
        to: { type: TYPE_RIGHT, x: 474, y: 304.5 },
      }]);
    });
  });

  describe('makeArrowLine', () => {
    describe('When "n" is 50', () => {
      const n = 50;

      it('When goes from left to right', () => {
        const from = { type: TYPE_RIGHT, x: 100, y: 100 };
        const to = { type: TYPE_LEFT, x: 200, y: 100 };

        expect(makeArrowLine(from, to, n)).toBe('M100,100 C150,100 150,100 200,100');
      });

      it('When goes from right to left', () => {
        const from = { type: TYPE_LEFT, x: 100, y: 100 };
        const to = { type: TYPE_RIGHT, x: 0, y: 100 };

        expect(makeArrowLine(from, to, n)).toBe('M100,100 C50,100 50,100 0,100');
      });

      it('When goes from top to bottom', () => {
        const from = { type: TYPE_BOTTOM, x: 100, y: 100 };
        const to = { type: TYPE_TOP, x: 100, y: 0 };

        expect(makeArrowLine(from, to, n)).toBe('M100,100 C100,150 100,-50 100,0');
      });

      it('When goes from bottom to top', () => {
        const from = { type: TYPE_TOP, x: 100, y: 100 };
        const to = { type: TYPE_BOTTOM, x: 100, y: 200 };

        expect(makeArrowLine(from, to, n)).toBe('M100,100 C100,50 100,250 100,200');
      });
    });

    describe('When "n" is 100', () => {
      const n = 100;

      it('When goes from left to right', () => {
        const from = { type: TYPE_RIGHT, x: 100, y: 100 };
        const to = { type: TYPE_LEFT, x: 200, y: 100 };

        expect(makeArrowLine(from, to, n)).toBe('M100,100 C200,100 100,100 200,100');
      });

      it('When goes from right to left', () => {
        const from = { type: TYPE_LEFT, x: 100, y: 100 };
        const to = { type: TYPE_RIGHT, x: 0, y: 100 };

        expect(makeArrowLine(from, to, n)).toBe('M100,100 C0,100 100,100 0,100');
      });

      it('When goes from top to bottom', () => {
        const from = { type: TYPE_BOTTOM, x: 100, y: 100 };
        const to = { type: TYPE_TOP, x: 100, y: 0 };

        expect(makeArrowLine(from, to, n)).toBe('M100,100 C100,200 100,-100 100,0');
      });

      it('When goes from bottom to top', () => {
        const from = { type: TYPE_TOP, x: 100, y: 100 };
        const to = { type: TYPE_BOTTOM, x: 100, y: 200 };

        expect(makeArrowLine(from, to, n)).toBe('M100,100 C100,0 100,300 100,200');
      });
    });
  });
});
