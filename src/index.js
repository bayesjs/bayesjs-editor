import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import configureStore from './store/configureStore';

import 'normalize.css';
import 'font-awesome/css/font-awesome.css';

const preloadedState = {
  nodes: [
    {
      id: 'RAIN',
      states: ['T', 'F'],
      parents: [],
      position: { x: 395, y: 80 },
    },
    {
      id: 'SPRINKLER',
      states: ['T', 'F'],
      parents: ['RAIN'],
      position: { x: 160, y: 90 },
    },
    {
      id: 'GRASS_WET',
      states: ['T', 'F'],
      parents: ['RAIN', 'SPRINKLER'],
      position: { x: 230, y: 235 },
    },
  ],
};

const store = configureStore(preloadedState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
