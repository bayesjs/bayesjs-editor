import { compose, pure, withHandlers } from 'recompose';
import { isFunction } from 'lodash';

const enhance = compose(
  pure,
  withHandlers({
    onMouseDown: ({ onMouseDown }) => node => e =>
      isFunction(onMouseDown) && onMouseDown(node, e),
    onDoubleClick: ({ onDoubleClick }) => node => e =>
      isFunction(onDoubleClick) && onDoubleClick(node, e),
    onStateDoubleClick: ({ onStateDoubleClick }) => node => state => () =>
      isFunction(onStateDoubleClick) && onStateDoubleClick(node, state),
  }),
);

export default enhance;
