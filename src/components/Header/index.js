import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { newNetwork } from '../../actions';
import { getStateToSave } from '../../selectors';
import { download } from '../../utils/download';
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

  handleNewNetworkClick = () => {
    if (confirm('Os dados da rede atual serão perdidos. Deseja continuar?')) {
      this.props.dispatch(newNetwork());
      this.props.onRequestRedraw();
    }
  };

  handleSaveNetworkClick = () => {
    const json = JSON.stringify(this.props.stateToSave, null, 2);
    download('network.json', json);
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
            <li className={styles.menuItem} onClick={this.handleNewNetworkClick}>Nova Rede</li>
            <li className={styles.menuItem}>Abrir Rede</li>
            <li className={styles.menuItem} onClick={this.handleSaveNetworkClick}>Salvar Rede</li>
          </ul>
        )}
      </div>
    );
  }
}

Header.propTypes = {
  stateToSave: PropTypes.object.isRequired,
  onRequestRedraw: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  stateToSave: getStateToSave(state),
});

export default connect(mapStateToProps)(Header);
