import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { newNetwork, loadNetwork, newMSBNNetwork, NETWORK_KINDS } from '../../actions';
import { getStateToSave } from '../../selectors';
import { openFile, saveFile } from '../../utils/file';
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

  handleNewNetworkClick = (e) => {
    e.preventDefault();
    if (confirm('Os dados da rede atual serão perdidos. Deseja continuar?')) {
      this.props.dispatch(newNetwork());
      this.props.onRequestRedraw();
    }
  };

  handleNewMSBNNetworkClick = (e) => {
    e.preventDefault();
    if (confirm('Os dados da rede atual serão perdidos. Deseja continuar?')) {
      this.props.dispatch(newNetwork(NETWORK_KINDS.MSBN));
      this.props.onRequestRedraw();
    }
  }

  handleOpenNetworkClick = (e) => {
    e.preventDefault();
    openFile('.json', json => {
      try {
        const state = JSON.parse(json);
        this.props.dispatch(loadNetwork(state));
        this.props.onRequestRedraw();
      } catch (ex) {
        alert('Arquivo inválido');
      }
    });
  };

  getNetworkName = () => {
    let { name } = this.props.stateToSave.network;

    if (name) {
      name = name.toLowerCase();
      name = name.replace(/[ ]/g, '_');

      return name || 'network';// In case the name is blank
    }
    return 'network';
  };

  handleSaveNetworkClick = (e) => {
    e.preventDefault();
    const json = JSON.stringify(this.props.stateToSave, null, 2);
    saveFile(`${this.getNetworkName()}.json`, json);
  };

  hasMSBNNetwork = () => {
    return true;
  }

  renderLiNetworkTypes = () => {
    return (
      <ul className={styles.subMenu}>
        {this.createLi('BN', this.handleNewNetworkClick)}
        {this.hasMSBNNetwork() ? this.createLi('MSBN', this.handleNewMSBNNetworkClick) : null}
      </ul>
    );
  }

  createLi = (name, handleOnClick) => {
    return (
      <li>
        <a href="" onClick={handleOnClick}>{name}</a>
      </li>
    );
  }

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
            <li>
              <a href="">Nova Rede</a>
              {this.renderLiNetworkTypes()}
            </li>
            <li>
              <a href="" onClick={this.handleOpenNetworkClick}>Abrir Rede</a>
            </li>
            <li>
              <a href="" onClick={this.handleSaveNetworkClick}>Salvar Rede</a>
            </li>
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