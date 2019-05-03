import { getNodeDescriptionHeight, getNodeHeaderHeight } from 'utils/node-size';

import { NODE_PADDING } from 'constants/node';
import { hasDescription } from 'validations/node';
import { withProps } from 'recompose';

const enhance = withProps(({
  size,
  canMove,
  ...props
}) => {
  const height = getNodeHeaderHeight();
  const width = size.width - (NODE_PADDING * 2);

  return {
    textX: NODE_PADDING,
    textY: 0,
    textHeight: getNodeHeaderHeight(),
    textWidth: width,
    descriptionX: NODE_PADDING,
    descriptionY: height,
    descriptionHeight: getNodeDescriptionHeight(),
    descriptionWidth: width,
    style: { cursor: (canMove ? 'nove' : 'pointer') },
    showDescription: hasDescription(props),
  };
});

export default enhance;
