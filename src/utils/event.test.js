import { isDeleteKey } from './event';

const createKeyboarEvent = (props = {}) =>
  new global.KeyboardEvent('keyup', props);

describe('Event Utils', () => {
  describe('isDeleteKey', () => {
    describe('When "backspace" event is triggered', () => {
      const code = 8;

      it('returns truthy (keyCode)', () => {
        const event = createKeyboarEvent({ keyCode: code });

        expect(isDeleteKey(event)).toBeTruthy();
      });

      it('returns truthy (which)', () => {
        const event = createKeyboarEvent({ which: code });

        expect(isDeleteKey(event)).toBeTruthy();
      });
    });

    describe('When "delete" event is triggered', () => {
      const code = 46;

      it('returns truthy (keyCode)', () => {
        const event = createKeyboarEvent({ keyCode: code });

        expect(isDeleteKey(event)).toBeTruthy();
      });

      it('returns truthy (which)', () => {
        const event = createKeyboarEvent({ which: code });

        expect(isDeleteKey(event)).toBeTruthy();
      });
    });

    describe('When another event is triggered', () => {
      it('returns falsy (keyCode)', () => {
        const event = createKeyboarEvent();

        expect(isDeleteKey(event)).toBeFalsy();
      });

      it('returns falsy (which)', () => {
        const event = createKeyboarEvent();

        expect(isDeleteKey(event)).toBeFalsy();
      });
    });
  });
});
