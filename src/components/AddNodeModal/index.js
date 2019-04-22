import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { nodePropTypes, positionPropTypes } from 'models';

import { addNode } from 'actions';
import { getNodes } from 'selectors';
import Button from '../Button';
import EditStatesList from '../EditStatesList';
import Modal from '../Modal';
import styles from './styles.css';

const initialState = {
  name: '',
  states: ['Sim', 'Não'],
};

class AddNodeModal extends Component {
  state = initialState;

  componentDidMount() {
    setTimeout(() => {
      if (this.inputName) this.inputName.focus();
    }, 0);

    window.addEventListener('keyup', this.handleKeyup);
  }

  componentWillReceiveProps(nextProps) {
    const { position } = this.props;

    if (position == null && nextProps.position != null) {
      this.setState(initialState);
      setTimeout(() => this.inputName.focus(), 0);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyup);
  }

  handleKeyup = (e) => {
    const key = e.keyCode || e.which;

    if (key === 13 && this.valid().success) {
      this.handleAdicionarClick();
    }
  }

  handleNameBlur = (e) => {
    this.setState({ name: e.target.value });
  };

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

  valid = () => {
    const { name, states } = this.state;
    const { nodes } = this.props;
    let focusName = false;
    let message;


    if (name === '') {
      message = 'Preencha o nome da variável corretamente';
      focusName = true;
    } else if (nodes.some(x => x.id === name)) {
      message = 'Já existe uma variável com este nome';
      focusName = true;
    } else if (states.length === 0) {
      message = 'Você deve informar pelo menos um estado';
    }

    return {
      message,
      focusName,
      success: message === undefined,
    };
  }

  handleAdicionarClick = () => {
    const { position, dispatch, onRequestClose } = this.props;
    const { message, focusName, success } = this.valid();

    if (success === false) {
      window.alert(message);
      if (focusName) this.inputName.focus();
      return;
    }

    const { name, states } = this.state;

    dispatch(addNode(name, states, position));
    onRequestClose();
  };

  render() {
    const { position, onRequestClose } = this.props;
    const { states, name } = this.state;

    let children = null;

    if (position != null) {
      children = (
        <form className={styles.container}>
          <div className={styles.fieldWrapper}>
            <label htmlFor="name">
              Nome
              <input
                id="name"
                type="text"
                defaultValue={name}
                onInput={this.handleNameBlur}
                ref={(ref) => { this.inputName = ref; }}
              />
            </label>
          </div>

          <span>Estados</span>

          <EditStatesList
            states={states}
            onAddState={this.handleAddState}
            onDeleteState={this.handleDeleteState}
          />

          <div className={styles.buttons}>
            <Button primary onClick={this.handleAdicionarClick} name="add">
              Adicionar
            </Button>
            <Button onClick={onRequestClose} name="cancel">
              Cancelar
            </Button>
          </div>
        </form>
      );
    }

    return (
      <Modal
        title="Adicionar Variável"
        isOpen={position != null}
        onRequestClose={onRequestClose}
        name="add-node"
      >
        {children}
      </Modal>
    );
  }
}

AddNodeModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes).isRequired,
  position: PropTypes.objectOf(positionPropTypes).isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  nodes: getNodes(state),
});

export default connect(mapStateToProps)(AddNodeModal);
