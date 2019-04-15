import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getNetwork, getNetworkKind } from '../../selectors';
import { NETWORK_KINDS, changeNetworkProperty } from '../../actions';
import { getComponentTestId } from '../../utils/test-utils';
import { networkPropTypes } from '../../models';
import styles from './styles.css';

class PropertiesNetwork extends Component {
  handleNetworkPropertyBlur = (e) => {
    const { dispatch } = this.props;
    const { id, value } = e.target;

    dispatch(changeNetworkProperty(id, value));
  };

  onChangeCheck = (e) => {
    const { dispatch } = this.props;
    const { id, checked } = e.target;

    dispatch(changeNetworkProperty(id, checked));
  }

  handleKeyUp = (e) => {
    const key = e.keyCode || e.which;

    if (key === 13) {
      this.handleNetworkPropertyBlur(e);
    }
  };

  handleNetworkSizeBlur = (e) => {
    const { dispatch, network } = this.props;
    const input = e.target;
    const name = input.id;
    const value = parseInt(input.value, 10);

    if (Number.isNaN(value)) {
      input.value = network[name];
    } else {
      dispatch(changeNetworkProperty(name, value));
    }
  };

  handleNetworkSizeBlurKeyup = (e) => {
    const key = e.keyCode || e.which;

    if (key === 13) {
      this.handleNetworkSizeBlur(e);
    }
  };

  typeNetwork = () => {
    const { networkKind } = this.props;

    if (networkKind === NETWORK_KINDS.MSBN) {
      return 'Rede Bayesiana Multi-Seccionada';
    }
    return 'Rede Bayesiana';
  };

  render() {
    const { network } = this.props;

    return (
      <div data-testid={getComponentTestId('PropertiesNetwork')}>
        <h2>Propriedades da Rede</h2>
        <h3>{this.typeNetwork()}</h3>

        <div className={styles.fieldWrapper}>
          <label htmlFor="name">
          Nome
            <input
              id="name"
              type="text"
              defaultValue={network.name}
              onBlur={this.handleNetworkPropertyBlur}
              onKeyUp={this.handleKeyUp}
            />
          </label>

        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="description">
          Descrição
            <textarea
              id="description"
              defaultValue={network.description || ''}
              onBlur={this.handleNetworkPropertyBlur}
            />
          </label>
        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="height">
          Altura
            <input
              id="height"
              type="text"
              defaultValue={network.height}
              onBlur={this.handleNetworkSizeBlur}
              onKeyUp={this.handleNetworkSizeBlurKeyup}
            />
          </label>

        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="width">
          Largura
            <input
              id="width"
              type="text"
              defaultValue={network.width}
              onBlur={this.handleNetworkSizeBlur}
              onKeyUp={this.handleNetworkSizeBlurKeyup}
            />
          </label>
        </div>

        <div className={styles.checkbox}>
          <label htmlFor="inferenceEnabled">
            <input
              id="inferenceEnabled"
              type="checkbox"
              checked={network.inferenceEnabled === undefined ? true : network.inferenceEnabled}
              onChange={this.onChangeCheck}
            />
            Ativar Inferência
          </label>
        </div>
      </div>
    );
  }
}

PropertiesNetwork.propTypes = {
  network: networkPropTypes.isRequired,
  dispatch: PropTypes.func.isRequired,
  networkKind: PropTypes.string.isRequired,
};


const mapStateToProps = state => ({
  network: getNetwork(state),
  networkKind: getNetworkKind(state),
});

export default connect(mapStateToProps)(PropertiesNetwork);
