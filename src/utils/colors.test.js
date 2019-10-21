import { times } from 'ramda';
import shuffle from 'shuffle-array';
import { getRandomColor } from './colors';

describe('Colors Utils', () => {
  describe('getRandomColor', () => {
    describe('When getting the first color', () => {
      it('returns "#D84315"', () => {
        expect(getRandomColor()).toBe('#D84315');
      });

      it('calls shuffle method', () => {
        expect(shuffle).toHaveBeenCalledTimes(1);
      });
    });

    describe('When getting the second color', () => {
      it('returns "#BF360C"', () => {
        expect(getRandomColor()).toBe('#BF360C');
      });

      it('does not call shuffle method', () => {
        expect(shuffle).toHaveBeenCalledTimes(1);
      });
    });

    describe('When getting the 23˚ color', () => {
      beforeEach(() => {
        times(getRandomColor, 21);
      });

      it('calls shuffle method', () => {
        expect(shuffle).toHaveBeenCalledTimes(2);
      });
    });
  });
});
