import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { changeNetworkProperty, changeNodeId } from '../../actions';
import { getNetwork, getNodes, getSelectedNode } from '../../selectors';
import Button from '../Button';
import styles from './styles.css';

class PropertiesPanel extends Component {
  handleToggleClick = () => {
    const action = changeNetworkProperty(
      'propertiesPanelVisible',
      !this.props.network.propertiesPanelVisible
    );

    this.props.dispatch(action);
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
    const input = e.target;
    const id = this.props.selectedNode.id;
    const nextId = input.value;

    const alreadyExits = this.props.nodes
      .filter(x => x.id !== id)
      .some(x => x.id === nextId);

    if (nextId === '' || alreadyExits) {
      input.value = id;
    } else {
      this.props.dispatch(changeNodeId(id, nextId));
    }
  }

  renderNetworkProperties() {
    return (
      <div>
        <h2>Propriedades da Rede</h2>

        <div className={styles.fieldWrapper}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            defaultValue={this.props.network.name}
            onBlur={this.handleNetworkNameBlur}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="height">Altura</label>
          <input
            id="height"
            type="text"
            defaultValue={this.props.network.height}
            onBlur={this.handleNetworkSizeBlur}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="width">Largura</label>
          <input
            id="width"
            type="text"
            defaultValue={this.props.network.width}
            onBlur={this.handleNetworkSizeBlur}
          />
        </div>
      </div>
    );
  }

  renderSelectedNodeProperties() {
    const node = this.props.selectedNode;

    return (
      <div key={node.id}>
        <h2>Propriedades da Variável</h2>

        <div className={styles.fieldWrapper}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            defaultValue={node.id}
            onBlur={this.handleNodeNameBlur}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <Button onClick={() => this.props.onEditNodeStates(node)}>
            Editar estados
          </Button>
        </div>

        <div className={styles.fieldWrapper}>
          <Button onClick={() => this.props.onEditNodeCpt(node)}>
            Editar probabilidades
          </Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        className={classNames({
          [styles.panel]: true,
          [styles.panelShown]: this.props.network.propertiesPanelVisible,
        })}
      >
        <Button
          className={styles.toggleButton}
          onClick={this.handleToggleClick}
          title={this.props.network.propertiesPanelVisible ? 'Recolher' : 'Expandir'}
        >
          {this.props.network.propertiesPanelVisible ? (
            <i className="fa fa-arrow-right" />
          ) : (
            <i className="fa fa-arrow-left" />
          )}
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
  nodes: PropTypes.array.isRequired,
  selectedNode: PropTypes.object,
  onEditNodeStates: PropTypes.func.isRequired,
  onEditNodeCpt: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  network: getNetwork(state),
  nodes: getNodes(state),
  selectedNode: getSelectedNode(state),
});

export default connect(mapStateToProps)(PropertiesPanel);
