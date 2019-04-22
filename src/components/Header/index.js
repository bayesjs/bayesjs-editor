import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import fontAwesome from 'font-awesome/css/font-awesome.css';
import { v4 } from 'uuid';
import {
  NETWORK_KINDS,
  loadNetwork,
  newNetwork,
} from 'actions';
import { openFile, saveFile } from 'utils/file';

import { getComponentTestId } from 'utils/test-utils';
import { getStateToSave } from 'selectors';
import { networkPropTypes } from 'models';
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

  handleToggleMenu = (e) => {
    const { menuVisible } = this.state;

    e.stopPropagation();
    this.setState({ menuVisible: !menuVisible });
  };

  handleNewNetworkClick = (e) => {
    const { onRequestRedraw, dispatch } = this.props;

    e.preventDefault();
    if (window.confirm('Os dados da rede atual serão perdidos. Deseja continuar?')) {
      dispatch(newNetwork());
      onRequestRedraw();
    }
  };

  handleNewMSBNNetworkClick = (e) => {
    const { onRequestRedraw, dispatch } = this.props;

    e.preventDefault();
    if (window.confirm('Os dados da rede atual serão perdidos. Deseja continuar?')) {
      dispatch(newNetwork(NETWORK_KINDS.MSBN));
      onRequestRedraw();
    }
  }

  handleOpenNetworkClick = (e) => {
    const { onRequestRedraw, dispatch } = this.props;

    e.preventDefault();
    openFile('.json', (json) => {
      try {
        const state = JSON.parse(json);

        dispatch(loadNetwork(state));
        onRequestRedraw();
      } catch (ex) {
        console.warn(ex);
        window.alert('Arquivo inválido');
      }
    });
  };

  getNetworkName = () => {
    const { stateToSave } = this.props;
    const { name } = stateToSave.network;

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
      nodes: stateToSave.network.nodes || [],
      positions: stateToSave.network.positions || {},
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
      <a
        href=""
        onClick={handleOnClick}
        title={title}
        data-testid={getComponentTestId('Header', 'Item', name)}
      >
        {name}
      </a>
    </li>
  )

  render() {
    const { menuVisible } = this.state;

    return (
      <div className={styles.header}>
        <h1 className={styles.title}>Bayes Editor</h1>
        <Button
          title="Menu"
          className={styles.menuButton}
          onClick={this.handleToggleMenu}
          name="header"
        >
          <i className={`${fontAwesome.fa} ${fontAwesome.faBars}`} />
        </Button>
        {menuVisible && (
          <ul className={styles.menu}>
            <li>
              <a href="" onClick={this.handleNewNetworkClick}>Nova Rede</a>
              {this.renderLiNetworkTypes()}
            </li>
            <li>
              <a href="" data-testid={getComponentTestId('Header', 'Item', 'OpenNetwork')} onClick={this.handleOpenNetworkClick}>Abrir Rede</a>
            </li>
            <li>
              <a href="" data-testid={getComponentTestId('Header', 'Item', 'SaveNetwork')} onClick={this.handleSaveNetworkClick}>Salvar Rede</a>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

Header.propTypes = {
  stateToSave: networkPropTypes.isRequired,
  onRequestRedraw: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  stateToSave: getStateToSave(state),
});

export default connect(mapStateToProps)(Header);
