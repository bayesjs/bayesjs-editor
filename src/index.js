import React from 'react';
import { render } from 'react-dom';

import styles from './styles.css';

const App = props => {
  const { name } = props;

  return <h1 className={styles.app}>Hello, {name}</h1>;
};

render(
  <App name="fernando" />,
  document.getElementById('root')
);
