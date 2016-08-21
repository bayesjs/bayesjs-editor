import { PERSIST_STATE } from '../actions';

export const persistState = store => next => action => {
  if (action.type !== PERSIST_STATE) {
    return next(action);
  }

  const serializedState = JSON.stringify(store.getState());

  localStorage.setItem('state', serializedState);

  return undefined;
};

export const loadState = () => {
  const serializedState = localStorage.getItem('state');

  if (serializedState != null) {
    return JSON.parse(serializedState);
  }

  return undefined;
};
