import { CHANGE_NETWORK_PROPERTY } from '../actions';

const initialState = {
  name: 'Rede Bayesiana',
  height: 500,
  width: 800,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_NETWORK_PROPERTY:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
};
