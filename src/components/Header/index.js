import React from 'react';
import Button from '../Button';
import styles from './styles.css';

const Header = () => (
  <div className={styles.header}>
    <h1 className={styles.title}>Bayes Editor</h1>
    <Button
      title="Menu"
      className={styles.menuButton}
      onClick={() => alert('menu')}
    >
      <i className="fa fa-bars" />
    </Button>
  </div>
);

export default Header;
