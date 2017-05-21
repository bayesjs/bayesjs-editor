import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNodeStates } from '../../actions';
import EditStatesList from '../EditStatesList';
import Modal from '../Modal';
import Button from '../Button';
import styles from './styles.css';

class EditStatesModal extends Component {
  state = {
    states: [],
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.node == null && nextProps.node != null) {
      this.setState({ states: [...nextProps.node.states] });
      setTimeout(() => this.statesList.focusAddInput(), 0);
    }
  }

  handleAddState = newState => {
    this.setState({
      states: [...this.state.states, newState],
    });
  };

  handleDeleteState = state => {
    this.setState({
      states: this.state.states.filter(x => x !== state),
    });
  };

  handleSaveClick = () => {
    let states = this.state.states;

    if (states.length === 0) {
      alert('Você deve informar pelo menos um estado');
      return;
    }

    if (this.statesList.getAddInputText() !== '') {
      if (confirm('O estado preenchido não foi adicionado na lista. Deseja adicionar?')) {
        states = [...states, this.statesList.getAddInputText()];
      }
    }

    this.props.dispatch(changeNodeStates(this.props.node.id, states));
    this.props.onRequestClose();
  };

  render() {
    const { node, onRequestClose } = this.props;
    let nodeId = '';
    let children = null;

    if (node != null) {
      nodeId = node.id;
      children = (
        <div className={styles.container}>
          <EditStatesList
            states={this.state.states}
            onAddState={this.handleAddState}
            onDeleteState={this.handleDeleteState}
            ref={ref => (this.statesList = ref)}
          />

          <div className={styles.buttons}>
            <Button primary onClick={this.handleSaveClick}>Salvar</Button>
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
  node: PropTypes.object,
  onRequestClose: PropTypes.func.isRequired,
};

export default connect()(EditStatesModal);
