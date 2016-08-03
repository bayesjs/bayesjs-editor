import { createStore } from 'redux';
import rootReducer from '../reducers';

export default preloadedState => {
  const store = createStore(rootReducer, preloadedState);

  return store;
};
