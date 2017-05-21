import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNetworkProperty } from '../../actions';
import { getNetwork } from '../../selectors';
import styles from './styles.css';

class PropertiesNetwork extends Component {
  constructor(props) {
    super(props);
  }

  handleNetworkPropertyBlur = (e) => {
    const { id, value } = e.target;

    this.props.dispatch(changeNetworkProperty(id, value));
  };

  handleKeyUp = (e) => {
    const key = e.keyCode || e.which;

    if (key === 13) {
      this.handleNetworkPropertyBlur(e);
    }
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

  handleNetworkSizeBlurKeyup = (e) => {
    const key = e.keyCode || e.which;

    if (key === 13) {
      this.handleNetworkSizeBlur(e);
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
            onBlur={this.handleNetworkPropertyBlur}
            onKeyUp={this.handleKeyUp}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            defaultValue={network.description || ''}
            onBlur={this.handleNetworkPropertyBlur}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="height">Altura</label>
          <input
            id="height"
            type="text"
            defaultValue={network.height}
            onBlur={this.handleNetworkSizeBlur}
            onKeyUp={this.handleNetworkSizeBlurKeyup}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="width">Largura</label>
          <input
            id="width"
            type="text"
            defaultValue={network.width}
            onBlur={this.handleNetworkSizeBlur}
            onKeyUp={this.handleNetworkSizeBlurKeyup}
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