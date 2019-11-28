import { v4 } from 'uuid';
import { NEW_NETWORK, LOAD_NETWORK } from 'actions';
import { path, either } from 'ramda';

const getNetworkId = either(
  path(['payload', 'state', 'network', 'id']),
  v4,
);

export default (state = '', action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return v4();
    case LOAD_NETWORK:
      return getNetworkId(action);
    default:
      return state;
  }
};
