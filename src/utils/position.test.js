import { subtractPositions } from './position';

describe('Position Utils', () => {
  describe('subtractPositions', () => {
    it('subtracts two positions', () => {
      const positionA = { x: 100, y: 50 };
      const positionB = { x: 5, y: 10 };

      expect(subtractPositions(positionA, positionB)).toEqual({
        x: 95,
        y: 40,
      });
    });
  });
});
