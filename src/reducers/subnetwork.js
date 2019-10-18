import {
  ADD_SUPER_NODE,
  LOAD_NETWORK,
  NEW_NETWORK,
  REMOVE_SUPER_NODE,
} from 'actions';

import { getRandomColor } from 'utils/colors';

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
    default:
      return state;
  }
};
