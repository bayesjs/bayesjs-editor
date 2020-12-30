import { LOAD_NETWORK, NEW_NETWORK } from '@actions';
import { either, path } from 'ramda';

import { v4 } from 'uuid';

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
