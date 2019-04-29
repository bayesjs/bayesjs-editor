import {
  compose, pure, withStateHandlers, withHandlers,
} from 'recompose';
import { equals, isNil } from 'ramda';
import { isFunction } from 'lodash';

const isKeyFocused = (key, keyFocus) => isNil(keyFocus) || equals(key, keyFocus);

const enhance = compose(
  pure,
  withStateHandlers(
    ({ initialKeyFocus = null }) => ({
      keyFocus: initialKeyFocus,
    }),
    {
      onMouseOver: () => keyFocus => ({
        keyFocus,
      }),
      onMouseLeave: (_, { initialKeyFocus }) => () => ({
        keyFocus: initialKeyFocus,
      }),
    },
  ),
  withHandlers({
    getStrokeOpacity: () => (key, keyFocused) => isKeyFocused(key, keyFocused) ? 1 : 0.2,
    getMarkEndStyle: () => (key, keyFocused) =>
      isKeyFocused(key, keyFocused)
        ? 'url(#triangle)'
        : 'url(##triangle-with-low-opacity)',
    onMouseDown: ({ onMouseDown }) => opts => e =>
      isFunction(onMouseDown)
        ? onMouseDown(e, opts)
        : null,
  }),
);

export default enhance;
