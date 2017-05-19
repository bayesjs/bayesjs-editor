import { PERSIST_STATE } from '../actions';
import { getStateToSave } from '../selectors';

export const persistState = store => next => action => {
  if (action.type !== PERSIST_STATE) {
    return next(action);
  }

  const stateToSave = getStateToSave(store.getState());
  const serializedState = JSON.stringify(stateToSave);

  localStorage.setItem('state', serializedState);

  return undefined;
};

export const loadState = () => {
  const serializedState = localStorage.getItem('state');

  if (serializedState != null) {
    const state = JSON.parse(serializedState);

    if (state.version === 2) {
      // let { network, nodes, positions } = state

      // if (network.kind === undefined) network.kind = NETWORK_KINDS.BN;
      // if (network.id === undefined) network.id = v4();

      // if (nodes && positions) {
      //   return {
      //     ...network,
      //     nodes,
      //     positions
      //   };
      // }
    } else if (state.version < 2) {
      return undefined;
    }

    delete state.version;

    return state;
  }

  return undefined;
};
