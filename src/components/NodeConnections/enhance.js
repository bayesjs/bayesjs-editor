import {
  branch,
  compose,
  pure,
  renderNothing,
  withProps,
} from 'recompose';
import { getNodeConnectionsHeight, getNodeConnectionsOffset } from '@utils/node-size';
import { not, path, pipe } from 'ramda';

import { NODE_PADDING } from '@constants/node';
import { hasConnections } from '@validations/node';

const pathConnections = path(['linkedNode', 'connections']);
const hasNoLinkedNodes = pipe(hasConnections, not);

const enhance = compose(
  pure,
  branch(hasNoLinkedNodes, renderNothing),
  withProps((props) => {
    const yOffset = getNodeConnectionsOffset(props);
    const height = getNodeConnectionsHeight();

    return {
      dividerY: yOffset,
      textX: NODE_PADDING,
      textY: yOffset,
      circlesY: yOffset + 10,
      textHeight: height,
      connections: pathConnections(props),
    };
  }),
);

export default enhance;
