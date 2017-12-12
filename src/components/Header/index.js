import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { newNetwork, loadNetwork, newMSBNNetwork, NETWORK_KINDS } from '../../actions';
import { getStateToSave } from '../../selectors';
import { openFile, saveFile } from '../../utils/file';
import Button from '../Button';
import { v4 } from 'uuid';
import styles from './styles.css';
import fontAwesome from 'font-awesome/css/font-awesome.css';

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

  handleToggleMenu = (e) => {
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
    openFile('.json', (json) => {
      try {
        const state = JSON.parse(json);

        this.props.dispatch(loadNetwork(state));
        this.props.onRequestRedraw();
      } catch (ex) {
        console.warn(ex);
        alert('Arquivo inválido');
      }
    });
  };

  getNetworkName = () => {
    const { name } = this.props.stateToSave.network;

    if (name) {
      let newName = name.trim();
      newName = newName.toLowerCase();
      newName = newName.replace(/[.]/g, '');
      newName = newName.replace(/[ ]/g, '_');

      return newName || 'network';// In case the name is blank
    }
    return 'network';
  };

  stateToSave = () => {
    const { stateToSave } = this.props;
    const state = {
      ...stateToSave,
      network: {
        ...stateToSave.network,
      },
    };

    if (!state.network.id) {
      state.network.id = v4();
    }

    return state;
  }

  handleSaveNetworkClick = (e) => {
    e.preventDefault();
    const json = JSON.stringify(this.stateToSave(), null, 2);
    saveFile(`${this.getNetworkName()}.json`, json);
  };

  hasMSBNNetwork = () => true

  renderLiNetworkTypes = () => (
    <ul className={styles.subMenu}>
      {this.createLi('BN', this.handleNewNetworkClick, 'Rede Bayesiana')}
      {this.hasMSBNNetwork() ? this.createLi('MSBN', this.handleNewMSBNNetworkClick, 'Rede Bayesiana Multi-seccionada') : null}
    </ul>
  )

  createLi = (name, handleOnClick, title = '') => (
    <li>
      <a href="" onClick={handleOnClick} title={title}>{name}</a>
    </li>
  )

  render() {
    return (
      <div className={styles.header}>
        <h1 className={styles.title}>Bayes Editor</h1>
        <Button
          title="Menu"
          className={styles.menuButton}
          onClick={this.handleToggleMenu}
        >
          <i className={`${fontAwesome.fa} ${fontAwesome.faBars}`} />
        </Button>
        {this.state.menuVisible && (
          <ul className={styles.menu}>
            <li>
              <a href="" onClick={this.handleNewNetworkClick}>Nova Rede</a>
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
