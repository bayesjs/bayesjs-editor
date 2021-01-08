import { LOAD_NETWORK, NEW_NETWORK } from '@actions';
import { always, either, path } from 'ramda';

import { NETWORK_KINDS } from '@constants/network';

const defaultValue = NETWORK_KINDS.BN;
const getNetworKind = either(
  path(['payload', 'state', 'network', 'kind']),
  always(defaultValue),
);

export default (state = defaultValue, action) => {
  switch (action.type) {
    case NEW_NETWORK:
      return action.kind;
    case LOAD_NETWORK:
      return getNetworKind(action);
    default:
      return state;
  }
};
