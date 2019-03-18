import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Modal from 'react-modal';
import configureStore from './store/configureStore';
import { loadState } from './middlewares/persistState';
import App from './components/App';

import 'normalize.css';
import 'font-awesome/css/font-awesome.css';

const preloadedState = loadState();
const store = configureStore(preloadedState);
const root = document.getElementById('root');

Modal.setAppElement(root);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  root,
);
