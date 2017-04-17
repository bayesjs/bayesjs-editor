import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNetworkProperty } from '../../actions';
import { getNetwork } from '../../selectors';
import styles from './styles.css';

class PropertiesNetwork extends Component {
  constructor(props) {
    super(props);
  }

  handleNetworkNameBlur = e => {
    const name = e.target.id;
    const value = e.target.value;
    this.props.dispatch(changeNetworkProperty(name, value));
  };
  
  handleNetworkSizeBlur = e => {
    const input = e.target;
    const name = input.id;
    const value = parseInt(input.value, 10);

    if (isNaN(value)) {
      input.value = this.props.network[name];
    } else {
      this.props.dispatch(changeNetworkProperty(name, value));
    }
  };

  render() {
    const { network } = this.props;

    return (
      <div>
        <h2>Propriedades da Rede</h2>

        <div className={styles.fieldWrapper}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            defaultValue={network.name}
            onBlur={this.handleNetworkNameBlur}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="height">Altura</label>
          <input
            id="height"
            type="text"
            defaultValue={network.height}
            onBlur={this.handleNetworkSizeBlur}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="width">Largura</label>
          <input
            id="width"
            type="text"
            defaultValue={network.width}
            onBlur={this.handleNetworkSizeBlur}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  network: getNetwork(state),
});


export default connect(mapStateToProps)(PropertiesNetwork);