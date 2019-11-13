import { roundValue } from './math';

describe('Math Utils', () => {
  describe('roundValue', () => {
    it('rounds values with 8 of precision', () => {
      expect(roundValue(1 / 3)).toBe(0.33333333);
    });
  });
});
