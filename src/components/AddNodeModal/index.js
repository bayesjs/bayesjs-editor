import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNode } from '../../actions';
import { getNodes } from '../../selectors';
import EditStatesList from '../EditStatesList';
import Modal from '../Modal';
import Button from '../Button';
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

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyup);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.position == null && nextProps.position != null) {
      this.setState(initialState);
      setTimeout(() => this.inputName.focus(), 0);
    }
  }

  handleKeyup = (e) => {
    const key = e.keyCode || e.which;

    if (key === 13 && this.valid().success) {
      this.handleAdicionarClick();
    }
  }

  handleNameBlur = e => {
    this.setState({ name: e.target.value });
  };

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

  valid = () => {
    const { name, states } = this.state;
    let focusName = false;
    let message;
    

    if (name === '') {
      message = 'Preencha o nome da variável corretamente';
      focusName = true;

    } else if (this.props.nodes.some(x => x.id === name)) {
      message = 'Já existe uma variável com este nome';
      focusName = true;
      
    } else if (states.length === 0) {
      message = 'Você deve informar pelo menos um estado';

    }

    return {
      message,
      focusName,
      success: message === undefined
    }
  }

  handleAdicionarClick = () => {
    const { message, focusName, success } = this.valid();
    
    if (success === false) {
      alert(message);
      if (focusName) this.inputName.focus();
      return;
    }

    const { name, states } = this.state;
    
    this.props.dispatch(addNode(name, states, this.props.position));
    this.props.onRequestClose();
  };

  render() {
    const { position, onRequestClose } = this.props;

    let children = null;

    if (position != null) {
      children = (
        <div className={styles.container}>
          <div className={styles.fieldWrapper}>
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              defaultValue={this.state.name}
              onInput={this.handleNameBlur}
              ref={ref => (this.inputName = ref)}
            />
          </div>

          <span>Estados</span>

          <EditStatesList
            states={this.state.states}
            onAddState={this.handleAddState}
            onDeleteState={this.handleDeleteState}
          />

          <div className={styles.buttons}>
            <Button primary onClick={this.handleAdicionarClick}>
              Adicionar
            </Button>
            <Button onClick={onRequestClose}>
              Cancelar
            </Button>
          </div>
        </div>
      );
    }

    return (
      <Modal
        title="Adicionar Variável"
        isOpen={position != null}
        onRequestClose={onRequestClose}
      >
        {children}
      </Modal>
    );
  }
}

AddNodeModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nodes: PropTypes.array.isRequired,
  position: PropTypes.object,
  onRequestClose: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  nodes: getNodes(state),
});

export default connect(mapStateToProps)(AddNodeModal);
