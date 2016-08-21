import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNodeStates } from '../../actions';
import Modal from '../Modal';
import Button from '../Button';
import styles from './styles.css';

class EditStates extends Component {
  state = {
    states: [],
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.node == null && nextProps.node != null) {
      this.setState({ states: [...nextProps.node.states] });
      setTimeout(() => this.input.focus(), 0);
    }
  }

  handleInputKeyDown = e => {
    if (e.key === 'Enter') {
      this.handleAddClick();
    }
  };

  handleAddClick = () => {
    const newState = this.input.value;

    if (newState === '') {
      return;
    }

    if (this.state.states.some(x => x === newState)) {
      alert('Este estado já foi adicionado');
      return;
    }

    this.setState({
      states: [...this.state.states, newState],
    });

    this.input.value = '';
  };

  handleRemoveClick = state => {
    this.setState({
      states: this.state.states.filter(x => x !== state),
    });
  };

  handleSaveClick = () => {
    if (this.state.states.length === 0) {
      alert('Você deve informar pelo menos um estado');
      return;
    }

    this.props.dispatch(changeNodeStates(this.props.node.id, this.state.states));
    this.props.onRequestClose();
  };

  render() {
    const { node, onRequestClose } = this.props;
    let children = null;

    if (node != null) {
      children = (
        <div className={styles.container}>
          <ul className={styles.stateList}>
            {this.state.states.map(state => (
              <li key={state}>
                <span>{state}</span>
                <Button
                  onClick={() => this.handleRemoveClick(state)}
                  title="Remover Estado"
                >
                  <i className="fa fa-trash" />
                </Button>
              </li>
            ))}
          </ul>

          <div className={styles.addState}>
            <input
              type="text"
              onKeyDown={this.handleInputKeyDown}
              ref={ref => (this.input = ref)}
            />
            <Button
              onClick={this.handleAddClick}
              title="Adicionar Estado"
            >
              <i className="fa fa-plus" />
            </Button>
          </div>

          <div className={styles.buttons}>
            <Button primary onClick={this.handleSaveClick}>Salvar</Button>
            <Button onClick={onRequestClose}>Cancelar</Button>
          </div>
        </div>
      );
    }

    return (
      <Modal
        title="Editar Estados"
        isOpen={node != null}
        onRequestClose={onRequestClose}
      >
        {children}
      </Modal>
    );
  }
}

EditStates.propTypes = {
  dispatch: PropTypes.func.isRequired,
  node: PropTypes.object,
  onRequestClose: PropTypes.func.isRequired,
};

export default connect()(EditStates);
