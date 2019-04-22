import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { subnetworkPropTypes } from 'models';
import Button from '../Button';
import styles from './styles.css';

class PropertiesSuperNode extends Component {
  getDrescription = (subnetwork) => {
    const { description } = subnetwork;

    if (description) {
      return (
        <h4>{subnetwork.description}</h4>
      );
    }
    return null;
  }

  render() {
    const {
      subnetwork, onViewSubnetwork, onViewLinkages, onStartConnection,
    } = this.props;

    return (
      <div>
        <h2>Propriedades da Rede</h2>
        <h3>{subnetwork.name}</h3>
        {this.getDrescription(subnetwork)}

        <div className={styles.fieldWrapper}>
          <Button onClick={() => onViewSubnetwork(subnetwork)}>
            Visualizar Rede
          </Button>
        </div>

        <div className={styles.fieldWrapper}>
          <Button onClick={() => onViewLinkages(subnetwork)}>
            Visualizar Uniões
          </Button>
        </div>

        <div className={styles.fieldWrapper}>
          <Button onClick={() => onStartConnection(subnetwork)}>
            Adicionar União
          </Button>
        </div>
      </div>
    );
  }
}

PropertiesSuperNode.propTypes = {
  subnetwork: subnetworkPropTypes.isRequired,
  onStartConnection: PropTypes.func.isRequired,
  onViewSubnetwork: PropTypes.func.isRequired,
  onViewLinkages: PropTypes.func.isRequired,
};

export default PropertiesSuperNode;
