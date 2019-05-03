import {
  pure,
  compose,
  branch,
  renderNothing,
  withProps,
} from 'recompose';
import { has, not, pipe } from 'ramda';
import { getNodeStateHeight } from 'utils/node-size';

const hasNoStates = pipe(has('states'), not);

const enhance = compose(
  pure,
  branch(hasNoStates, renderNothing),
  withProps(({ size }) => ({
    stateHeight: getNodeStateHeight(),
    stateWidth: size.width,
  })),
);

export default enhance;
