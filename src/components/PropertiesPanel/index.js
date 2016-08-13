import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNetworkProperty, changeNodeId } from '../../actions';
import { getNetwork, getSelectedNode } from '../../selectors';
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

  handleNodeNameBlur = e => {
    const id = this.props.selectedNode.id;
    const nextId = e.target.value;
    this.props.dispatch(changeNodeId(id, nextId));
  }

  renderNetworkProperties() {
    return (
      <div>
        <h2>Propriedades da Rede</h2>

        <label htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          defaultValue={this.props.network.name}
          onBlur={this.handleNetworkNameBlur}
        />

        <label htmlFor="height">Altura</label>
        <input
          id="height"
          type="text"
          defaultValue={this.props.network.height}
          onBlur={this.handleNetworkSizeBlur}
        />

        <label htmlFor="width">Largura</label>
        <input
          id="width"
          type="text"
          defaultValue={this.props.network.width}
          onBlur={this.handleNetworkSizeBlur}
        />
      </div>
    );
  }

  renderSelectedNodeProperties() {
    const node = this.props.selectedNode;

    return (
      <div key={node.id}>
        <h2>Propriedades da Variável</h2>

        <label htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          defaultValue={node.id}
          onBlur={this.handleNodeNameBlur}
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
          {this.props.selectedNode === null ? (
            this.renderNetworkProperties()
          ) : (
            this.renderSelectedNodeProperties()
          )}
        </div>
      </div>
    );
  }
}

PropertiesPanel.propTypes = {
  dispatch: PropTypes.func.isRequired,
  network: PropTypes.object.isRequired,
  selectedNode: PropTypes.object,
};

const mapStateToProps = state => ({
  network: getNetwork(state),
  selectedNode: getSelectedNode(state),
});

export default connect(mapStateToProps)(PropertiesPanel);
