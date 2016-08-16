import React, { Component, PropTypes } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import styles from './styles.css';

class EditStates extends Component {
  state = {
    states: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.node != null && this.props.node == null) {
      this.setState({ states: [...nextProps.node.states] });
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
            <Button primary onClick={() => alert('salvar')}>Salvar</Button>
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
  node: PropTypes.object,
  onRequestClose: PropTypes.func.isRequired,
};

export default EditStates;
