import { withProps } from 'recompose';

const getCx = index => 75 + (20 * index);
const enhance = withProps(({ index }) => ({
  cx: getCx(index),
}));

export default enhance;
