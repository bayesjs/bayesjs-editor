import {
  branch,
  compose,
  pure,
  renderNothing,
  withProps,
} from 'recompose';
import { not, pipe } from 'ramda';

import { getNodeStateHeight } from '@utils/node-size';
import { hasStates } from '@validations/node';

const hasNoStates = pipe(hasStates, not);

const enhance = compose(
  pure,
  branch(hasNoStates, renderNothing),
  withProps(({ size }) => ({
    stateHeight: getNodeStateHeight(),
    stateWidth: size.width,
  })),
);

export default enhance;
