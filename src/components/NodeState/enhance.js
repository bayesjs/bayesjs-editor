import { NODE_PADDING } from 'constants/node';
import { getNodeStatesOffset } from 'utils/node-size';
import { withProps } from 'recompose';

const enhance = withProps(({ index, width, ...props }) => {
  const finalWidth = ((width - NODE_PADDING * 2) / 2);

  return {
    y: getNodeStatesOffset(props, index),
    textX: NODE_PADDING,
    barX: finalWidth + NODE_PADDING,
    textWidth: finalWidth,
    barWidth: finalWidth,
  };
});

export default enhance;
