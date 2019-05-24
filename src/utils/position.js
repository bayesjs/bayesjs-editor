import { subtract } from 'ramda';

export const subtractPositions = (positionA, positionB) => ({
  x: subtract(positionA.x, positionB.x),
  y: subtract(positionA.y, positionB.y),
});
