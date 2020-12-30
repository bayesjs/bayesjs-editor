import { NODE_HEIGHT_SIZES, NODE_WIDTH_SIZE } from '@constants/node';
import {
  add,
  always,
  ifElse,
  length,
  multiply,
  pipe,
  prop,
  sum,
} from 'ramda';
import { hasConnections, hasDescription, hasStates } from '@validations/node';

const addOne = add(1);
const getStatesLength = pipe(
  prop('states'),
  length,
);
const sumAll = (...values) => sum(values);
const alwaysZero = always(0);

export const getNodeHeaderHeight = always(NODE_HEIGHT_SIZES.HEADER);
export const getNodeDescriptionHeight = always(NODE_HEIGHT_SIZES.DESCRIPTION);
export const getNodeStateHeight = always(NODE_HEIGHT_SIZES.STATE);
export const getNodeConnectionsHeight = always(NODE_HEIGHT_SIZES.CONNECTIONS);

const getHeightByDescription = ifElse(
  hasDescription,
  getNodeDescriptionHeight,
  alwaysZero,
);

const getHeightByStates = (node) => {
  if (hasStates(node)) {
    const counter = getStatesLength(node);

    return sumAll(
      NODE_HEIGHT_SIZES.STATE * counter,
      multiply(NODE_HEIGHT_SIZES.STATE_SPACE_BETWEEN, addOne(counter)),
    );
  }

  return 0;
};

const getHeightByConnections = ifElse(
  hasConnections,
  getNodeConnectionsHeight,
  alwaysZero,
);

export const getNodeStatesOffset = (node, index) =>
  sumAll(
    getHeightByDescription(node),
    getNodeHeaderHeight(),
    multiply(NODE_HEIGHT_SIZES.STATE, index),
    multiply(NODE_HEIGHT_SIZES.STATE_SPACE_BETWEEN, addOne(index)),
  );

export const getNodeConnectionsOffset = node =>
  sumAll(
    getNodeHeaderHeight(node),
    getHeightByDescription(node),
    getHeightByStates(node),
  );

export const getNodeHeight = node =>
  sumAll(
    getNodeHeaderHeight(node),
    getHeightByDescription(node),
    getHeightByStates(node),
    getHeightByConnections(node),
  );

export const getNodeWidth = always(NODE_WIDTH_SIZE);

export const getNodeSize = node => ({
  width: getNodeWidth(node),
  height: getNodeHeight(node),
});
