import {
  CHANGE_NETWORK_PROPERTY,
  REMOVE_NODE,
  CHANGE_NODE_ID,
} from '../actions';

const initialState = {
  name: 'Rede Bayesiana',
  height: 500,
  width: 800,
  selectedNodes: [],
  propertiesPanelVisible: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};
