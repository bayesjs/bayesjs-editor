import React, { Component } from 'react';
import Button from '../Button';
import styles from './styles.css';

class Header extends Component {
  state = {
    menuVisible: false,
  };

  componentDidMount() {
    window.addEventListener('click', this.handleWindowClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick);
  }

  handleWindowClick = () => {
    this.setState({ menuVisible: false });
  };

  handleToggleMenu = e => {
    e.stopPropagation();
    this.setState({ menuVisible: !this.state.menuVisible });
  };

  render() {
    return (
      <div className={styles.header}>
        <h1 className={styles.title}>Bayes Editor</h1>
        <Button
          title="Menu"
          className={styles.menuButton}
          onClick={this.handleToggleMenu}
        >
          <i className="fa fa-bars" />
        </Button>
        {this.state.menuVisible && (
          <ul className={styles.menu}>
            <li className={styles.menuItem}>Nova Rede</li>
            <li className={styles.menuItem}>Abrir Rede</li>
            <li className={styles.menuItem}>Salvar Rede</li>
          </ul>
        )}
      </div>
    );
  }
}

export default Header;
