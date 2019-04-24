import { applyMiddleware, compose, createStore } from 'redux';

import thunk from 'redux-thunk';
import rootReducer from 'reducers';
import { persistState } from '../middlewares/persistState';

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
