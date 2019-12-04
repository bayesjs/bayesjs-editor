import { SET_BELIEF, LOAD_NETWORK, NEW_NETWORK } from 'actions';
import { over, lensPath } from 'ramda';
import { updateNetworkBelief } from 'utils/network';

const defaultValue = {};

const setBelief = (state, action) => {
  const { nodeId, subnetworkId, state: nodeState } = action.payload;

  return over(
    lensPath(subnetworkId ? [subnetworkId] : []),
    updateNetworkBelief(nodeId, nodeState),
    state,
  );
};

export default (state = defaultValue, action) => {
  switch (action.type) {
    case LOAD_NETWORK:
    case NEW_NETWORK:
      return defaultValue;
    case SET_BELIEF:
      return setBelief(state, action);
    default:
      return state;
  }
};
