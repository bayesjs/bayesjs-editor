import React from 'react';
import { render } from 'react-dom';

const App = props => {
  const { name } = props;

  return <h1>Hello, {name}</h1>;
};

render(
  <App name="fernando" />,
  document.getElementById('root')
);
