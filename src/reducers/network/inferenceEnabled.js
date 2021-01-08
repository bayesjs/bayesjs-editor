import {
  LOAD_NETWORK,
  NEW_NETWORK,
  UPDATE_NETWORK_INFERENCE_ENABLED,
} from '@actions';
import { path, pathOr } from 'ramda';

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
