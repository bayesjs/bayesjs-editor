import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import styles from './styles.css';

class EditStatesList extends Component {
  getAddInputText = () => this.input.value;

  focusAddInput = () => {
    this.input.focus();
  };

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

    if (this.props.states.some(x => x === newState)) {
      alert('Este estado já foi adicionado');
      return;
    }

    this.props.onAddState(newState);
    this.input.value = '';
  };

  render() {
    const { states, onDeleteState } = this.props;

    return (
      <div>
        <ul className={styles.stateList}>
          {states.map(state => (
            <li key={state}>
              <span title={state}>{state}</span>
              <Button
                onClick={() => onDeleteState(state)}
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
      </div>
    );
  }
}

EditStatesList.propTypes = {
  states: PropTypes.array.isRequired,
  onAddState: PropTypes.func.isRequired,
  onDeleteState: PropTypes.func.isRequired,
};

export default EditStatesList;
