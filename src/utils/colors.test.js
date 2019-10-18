import { COLORS, getRandomColor } from './colors';

describe('Colors Utils', () => {
  describe('getRandomColor', () => {
    it('returns truthy (keyCode)', () => {
      const firstRandomColor = getRandomColor();
      const secondRandomColor = getRandomColor();

      if (COLORS.length === 1) {
        expect(firstRandomColor).toBe(secondRandomColor);
      } else {
        expect(firstRandomColor).not.toBe(secondRandomColor);
      }
    });
  });
});
