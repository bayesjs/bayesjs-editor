import {
  NEW_NETWORK,
  LOAD_NETWORK,
  CHANGE_NETWORK_PROPERTY,
  REMOVE_NODE,
  CHANGE_NODE_ID,
  SET_BELIEF,
} from '../actions';

const initialState = {
  name: 'Rede Bayesiana',
  height: 500,
  width: 800,
  selectedNodes: [],
  beliefs: {},
  propertiesPanelVisible: true,
};

const setBelief = (state, action) => {
  const beliefs = { ...state.beliefs };

  if (action.payload.state == null) {
    delete beliefs[action.payload.id];
  } else {
    beliefs[action.payload.id] = action.payload.state;
  }

  return {
    ...state,
    beliefs,
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return initialState;
    case LOAD_NETWORK:
      return action.payload.state.network;
    case CHANGE_NETWORK_PROPERTY:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case REMOVE_NODE:
      return {
        ...state,
        selectedNodes: [],
      };
    case CHANGE_NODE_ID:
      return {
        ...state,
        selectedNodes: state.selectedNodes.map(x =>
          (x === action.payload.id ? action.payload.nextId : x)
        ),
      };
    case SET_BELIEF:
      return setBelief(state, action);
    default:
      return state;
  }
};
