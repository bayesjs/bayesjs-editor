import React, { Component } from 'react';
import { camelCase, upperFirst } from 'lodash';
import { getNetwork, getNetworkKind } from '@selectors';
import {
  onUpdateNetworkDescription,
  onUpdateNetworkHeight,
  onUpdateNetworkInferenceEnabled,
  onUpdateNetworkName,
  onUpdateNetworkWidth,
} from '@actions/network';

import { NETWORK_KINDS } from '@constants/network';
import PropTypes from 'prop-types';
import { connectify } from '@decorators';
import { getComponentTestId } from '@utils/test-utils';
import { invoker } from 'ramda';
import { networkPropTypes } from '@models';
import styles from './styles.css';

class PropertiesNetwork extends Component {
  handleNetworkPropertyChange = (property, value) => {
    const actionName = `onChange${upperFirst(camelCase(property))}`;
    const method = invoker(1, actionName);

    method(value, this.props);
  }

  handleNetworkPropertyBlur = (e) => {
    const { id, value } = e.target;

    this.handleNetworkPropertyChange(id, value);
  };

  onChangeCheck = (e) => {
    const { onChangeInferenceEnabled } = this.props;
    const { checked } = e.target;

    onChangeInferenceEnabled(checked);
  }

  handleKeyUp = (e) => {
    const key = e.keyCode || e.which;

    if (key === 13) {
      this.handleNetworkPropertyBlur(e);
    }
  };

  handleNetworkSizeBlur = (e) => {
    const { network } = this.props;
    const input = e.target;
    const name = input.id;
    const value = parseInt(input.value, 10);

    if (Number.isNaN(value)) {
      input.value = network[name];
    } else {
      this.handleNetworkPropertyChange(name, value);
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
  networkKind: PropTypes.string.isRequired,
  onChangeName: PropTypes.func.isRequired, // eslint-disable-line
  onChangeDescription: PropTypes.func.isRequired, // eslint-disable-line
  onChangeHeight: PropTypes.func.isRequired, // eslint-disable-line
  onChangeWidth: PropTypes.func.isRequired, // eslint-disable-line
  onChangeInferenceEnabled: PropTypes.func.isRequired,
};

const enhance = connectify({
  network: getNetwork,
  networkKind: getNetworkKind,
}, () => ({
  onChangeName: onUpdateNetworkName,
  onChangeDescription: onUpdateNetworkDescription,
  onChangeHeight: onUpdateNetworkHeight,
  onChangeWidth: onUpdateNetworkWidth,
  onChangeInferenceEnabled: onUpdateNetworkInferenceEnabled,
}));

export default enhance(PropertiesNetwork);
