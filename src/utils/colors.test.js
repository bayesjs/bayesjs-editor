import { times } from 'ramda';
import { COLORS, getRandomColor } from './colors';

describe('Colors Utils', () => {
  describe('getRandomColor', () => {
    beforeAll(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterAll(() => {
      Math.random.mockRestore();
    });

    it('returns "#388E3C" on the first time', () => {
      expect(getRandomColor()).toBe('#388E3C');
    });

    it('returns "#D84315" on the second time', () => {
      expect(getRandomColor()).toBe('#D84315');
    });

    it('returns "#388E3C" on the twenty first time', () => {
      times(getRandomColor, COLORS.length - 2);
      expect(getRandomColor()).toBe('#388E3C');
    });
  });
});
