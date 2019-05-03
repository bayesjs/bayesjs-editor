import { withProps } from 'recompose';

const getResult = (results, state, belief) => {
  if (belief !== null) {
    return belief === state ? 1 : 0;
  }

  return results[state];
};

const getTextX = (x, width, result) => {
  const finalX = x + (width / 2) - 18;

  return result === 1 ? finalX - 4 : finalX;
};

const enhance = withProps(({
  results,
  state,
  belief,
  x,
  y,
  width,
}) => {
  const result = getResult(results, state, belief);

  return {
    textX: getTextX(x, width, result),
    textY: y + 12,
    barX: x + (width - (width * result)),
    barY: y,
    barWidth: width * result,
    percentText: `${(100 * result).toFixed(2)} %`,
    fillColor: belief != null ? '#EE4040' : '#9f9ff6',
  };
});

export default enhance;
