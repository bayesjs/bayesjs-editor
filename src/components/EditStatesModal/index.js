import React, { Component } from 'react';

import Button from 'components/Button';
import EditStatesList from 'components/EditStatesList';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import { changeNodeStates } from 'actions';
import { connect } from 'react-redux';
import { nodePropTypes } from 'models';
import styles from './styles.css';

class EditStatesModal extends Component {
  state = {
    states: [],
  };

  componentWillReceiveProps(nextProps) {
    const { node } = this.props;

    if (node == null && nextProps.node != null) {
      this.setState({ states: [...nextProps.node.states] });
      setTimeout(() => this.statesList.focusAddInput(), 0);
    }
  }

  handleAddState = (newState) => {
    const { states } = this.state;

    this.setState({
      states: [...states, newState],
    });
  };

  handleDeleteState = (state) => {
    const { states } = this.state;

    this.setState({
      states: states.filter(x => x !== state),
    });
  };

  handleSaveClick = () => {
    const { dispatch, node, onRequestClose } = this.props;
    let { states } = this.state;

    if (states.length === 0) {
      window.alert('Você deve informar pelo menos um estado');
      return;
    }

    if (this.statesList.getAddInputText() !== '') {
      if (window.confirm('O estado preenchido não foi adicionado na lista. Deseja adicionar?')) {
        states = [...states, this.statesList.getAddInputText()];
      }
    }

    dispatch(changeNodeStates(node.id, states));
    onRequestClose();
  };

  render() {
    const { node, onRequestClose } = this.props;
    const { states } = this.state;
    let nodeId = '';
    let children = null;

    if (node != null) {
      nodeId = node.id;
      children = (
        <div className={styles.container}>
          <EditStatesList
            states={states}
            onAddState={this.handleAddState}
            onDeleteState={this.handleDeleteState}
            ref={(ref) => { this.statesList = ref; }}
          />

          <div className={styles.buttons}>
            <Button primary onClick={this.handleSaveClick} name="save">Salvar</Button>
            <Button onClick={onRequestClose}>Cancelar</Button>
          </div>
        </div>
      );
    }

    return (
      <Modal
        title={`Editar Estados (${nodeId})`}
        isOpen={node != null}
        onRequestClose={onRequestClose}
      >
        {children}
      </Modal>
    );
  }
}

EditStatesModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  node: nodePropTypes,
  onRequestClose: PropTypes.func.isRequired,
};

EditStatesModal.defaultProps = {
  node: null,
};

export default connect()(EditStatesModal);
