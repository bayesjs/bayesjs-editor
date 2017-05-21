import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNodeId } from '../../actions';
import { getNodes } from '../../selectors';
import Button from '../Button';
import styles from './styles.css';

class PropertiesSuperNode extends Component {
  constructor(props) {
    super(props);
  }

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
    const { subnetwork } = this.props;

    return (
      <div>
        <h2>Propriedades da Rede</h2>
        <h3>{subnetwork.name}</h3>
        {this.getDrescription(subnetwork)}

        <div className={styles.fieldWrapper}>
          <Button onClick={() => this.props.onViewSubnetwork(subnetwork)}>
            Visualizar Rede
          </Button>
        </div>

        <div className={styles.fieldWrapper}>
          <Button onClick={() => this.props.onViewLinkages(subnetwork)}>
            Visualizar Uniões
          </Button>
        </div>

        <div className={styles.fieldWrapper}>
          <Button onClick={() => this.props.onStartConnection(subnetwork)}>
            Adicionar União
          </Button>
        </div>
      </div>
    );
  }
}

PropertiesSuperNode.propTypes = {
  subnetwork: PropTypes.object.isRequired,
  onStartConnection: PropTypes.func.isRequired,
  onViewSubnetwork: PropTypes.func.isRequired,
  onViewLinkages: PropTypes.func.isRequired,
};

export default PropertiesSuperNode;