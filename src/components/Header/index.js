import React from 'react';
import Button from '../Button';
import styles from './styles.css';

const Header = () => (
  <div className={styles.header}>
    <h1 className={styles.title}>Bayes Editor</h1>
    <Button
      title="Menu"
      className={styles.menuButton}
      onClick={() => console.log('¯\\_(ツ)_/¯')}
    >
      <i className="fa fa-bars" />
    </Button>
  </div>
);

export default Header;
