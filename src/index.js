import 'normalize.css';
import 'font-awesome/css/font-awesome.css';

import App from 'components/App';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import { loadState } from './middlewares/persistState';

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
