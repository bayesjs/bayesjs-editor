import {
  equals,
  has,
  isNil,
  length,
  pipe,
  prop,
} from 'ramda';

import { NETWORK_KINDS } from '../actions';

const NODE_HEIGHT_SIZES = {
  HEADER: 25,
  STATE: 18,
  MSBN: 18,
  LINKAGE: 34,
};

const NODE_WIDTH_SIZE = 160;

const hasStates = has('states');
const getStatesLength = pipe(
  prop('states'),
  length,
);
const isNetworwBN = kind => equals(NETWORK_KINDS.BN, kind);

const getHeightByStates = node =>
  hasStates(node) ? NODE_HEIGHT_SIZES.STATE * getStatesLength(node) : 0;
const isMSBNNode = ({ kind }) => isNetworwBN(kind);
const hasLinkages = ({ link }) => !isNil(link);

export const getNodeHeight = node =>
  NODE_HEIGHT_SIZES.HEADER
  + getHeightByStates(node)
  + (isMSBNNode(node) ? NODE_HEIGHT_SIZES.MSBN : 0)
  + (hasLinkages(node) ? NODE_HEIGHT_SIZES.LINKAGE : 0);

export const getNodeWidth = () => NODE_WIDTH_SIZE;

export const getNodeSize = node => ({
  width: getNodeWidth(node),
  height: getNodeHeight(node),
});
