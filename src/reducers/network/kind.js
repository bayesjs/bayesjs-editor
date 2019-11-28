import { NEW_NETWORK, LOAD_NETWORK } from 'actions';
import { NETWORK_KINDS } from 'constants/network';
import { always, path, either } from 'ramda';

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
