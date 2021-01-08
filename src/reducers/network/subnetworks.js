import {
  ADD_SUPER_NODE,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_SUPER_NODE,
  SET_BELIEF,
} from '@actions';
import {
  identity,
  ifElse,
  lensProp,
  map,
  over,
  propEq,
} from 'ramda';

import { getRandomColor } from '@utils/colors';
import { updateNetworkBelief } from '@utils/network';

const formatNetwork = (state) => {
  const { network, positions, nodes } = state;

  if (nodes && positions) {
    return {
      ...network,
      nodes,
      positions,
      color: getRandomColor(),
    };
  }

  return network;
};

export default (state = [], action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return [];
    case ADD_SUPER_NODE:
      return [
        ...state,
        formatNetwork(action.payload.state),
      ];
    case REMOVE_SUPER_NODE:
      return state
        .filter(n => n.id !== action.payload.id);

    case LOAD_NETWORK: {
      const { subnetworks } = action.payload.state.network;
      return subnetworks || [];
    }
    case SET_BELIEF:
      return map(
        ifElse(
          propEq('id', action.payload.subnetworkId),
          over(lensProp('beliefs'), updateNetworkBelief(action.payload.nodeId, action.payload.state)),
          identity,
        ),
        state,
      );
    default:
      return state;
  }
};
