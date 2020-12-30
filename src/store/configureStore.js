import { applyMiddleware, compose, createStore } from 'redux';

import { persistState } from '../middlewares/persistState';
import rootReducer from '@reducers';
import thunk from 'redux-thunk';

export default (preloadedState) => {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(thunk, persistState),
      window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
  );

  return store;
};
