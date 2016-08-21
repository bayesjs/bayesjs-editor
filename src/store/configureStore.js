import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistState } from '../middlewares/persistState';
import rootReducer from '../reducers';

export default preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      thunk,
      persistState,
    ),
  );

  return store;
};
