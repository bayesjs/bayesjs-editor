import {
  NEW_NETWORK,
  ADD_SUPER_NODE,
} from '../actions';

const formatNetwork = (state) => {
  const { network, positions, nodes } = state;

  if (nodes && positions) {
    return {
      ...network,
      nodes,
      positions
    };
  }
  
  return network;
}

export default (state = [], action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return [];
    case ADD_SUPER_NODE:
      return [
        ...state,
        formatNetwork(action.payload.state)
      ];
    default: 
      return state;
  }
}