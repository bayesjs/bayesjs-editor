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

  render() {
    const { subnetwork } = this.props;
    return (
      <div>
        <h2>Propriedades da Rede</h2>
        <h3>{subnetwork.name}</h3>

        <div className={styles.fieldWrapper}>
          <Button onClick={() => this.props.onStartConnection(subnetwork)}>
            Adicionar Ligação
          </Button>
        </div>
      </div>
    );
  }
}

PropertiesSuperNode.propTypes = {
  subnetwork: PropTypes.object.isRequired,
  onStartConnection: PropTypes.func.isRequired,
};

export default PropertiesSuperNode;