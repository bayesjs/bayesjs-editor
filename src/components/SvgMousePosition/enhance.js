import { noop } from 'lodash';
import {
  compose,
  withProps,
  defaultProps,
} from 'recompose';
import { once } from 'ramda';

const enhance = compose(
  defaultProps({ onFirstMove: noop }),
  withProps(({ onFirstMove }) => ({
    onFirstMoveOnce: once(onFirstMove),
  })),
);

export default enhance;
