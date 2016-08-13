import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNetworkProperty } from '../../actions';
import { getNetwork } from '../../selectors';
import classNames from 'classnames';
import Button from '../Button';
import styles from './styles.css';

class PropertiesPanel extends Component {
  state = {
    showing: true,
  };

  handleToggleClick = () => {
    this.setState({ showing: !this.state.showing });
  };

  handleNameBlur = e => {
    const name = e.target.id;
    const value = e.target.value;
    this.props.dispatch(changeNetworkProperty(name, value));
  };

  handleSizeBlur = e => {
    const input = e.target;
    const name = input.id;
    const value = parseInt(input.value, 10);

    if (isNaN(value)) {
      input.value = this.props.network[name];
    } else {
      this.props.dispatch(changeNetworkProperty(name, value));
    }
  };

  renderNetworkProperties() {
    return (
      <div>
        <h2>Rede Bayesiana</h2>

        <label htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          defaultValue={this.props.network.name}
          onBlur={this.handleNameBlur}
        />

        <label htmlFor="height">Altura</label>
        <input
          id="height"
          type="text"
          defaultValue={this.props.network.height}
          onBlur={this.handleSizeBlur}
        />

        <label htmlFor="width">Largura</label>
        <input
          id="width"
          type="text"
          defaultValue={this.props.network.width}
          onBlur={this.handleSizeBlur}
        />
      </div>
    );
  }

  render() {
    return (
      <div
        className={classNames({
          [styles.panel]: true,
          [styles.panelShown]: this.state.showing,
        })}
      >
        <Button
          className={styles.toggleButton}
          onClick={this.handleToggleClick}
        >
          <i className="fa fa-sliders" />Propriedades
        </Button>
        <div className={styles.content}>
          {this.renderNetworkProperties()}
        </div>
      </div>
    );
  }
}

PropertiesPanel.propTypes = {
  dispatch: PropTypes.func.isRequired,
  network: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  network: getNetwork(state),
});

export default connect(mapStateToProps)(PropertiesPanel);
