import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import configureStore from './store/configureStore';
import network from './networks/rain-sprinkler-grasswet';

import 'normalize.css';
import 'font-awesome/css/font-awesome.css';

const store = configureStore(network);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
