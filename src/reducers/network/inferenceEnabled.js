import {
  UPDATE_NETWORK_INFERENCE_ENABLED,
  LOAD_NETWORK,
  NEW_NETWORK,
} from 'actions';
import { pathOr, path } from 'ramda';

const defaultValue = true;
const getNetworkInfenceEnabled = pathOr(defaultValue, ['payload', 'state', 'network', 'inferenceEnabled']);
const getInferenceEnabled = path(['payload', 'inferenceEnabled']);

export default (state = defaultValue, action) => {
  switch (action.type) {
    case LOAD_NETWORK:
      return getNetworkInfenceEnabled(action);
    case NEW_NETWORK:
      return defaultValue;
    case UPDATE_NETWORK_INFERENCE_ENABLED:
      return getInferenceEnabled(action);
    default:
      return state;
  }
};
