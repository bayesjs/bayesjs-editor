import React, { Component } from 'react';

import PropTypes from 'prop-types';
import fontAwesome from 'font-awesome/css/font-awesome.css';
import Button from '../Button';
import styles from './styles.css';
import { statesPropTypes } from '../../models';

class EditStatesList extends Component {
  getAddInputText = () => this.input.value;

  focusAddInput = () => {
    this.input.focus();
  };

  handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.handleAddClick();
    }
  };

  handleAddClick = () => {
    const { states, onAddState } = this.props;
    const newState = this.input.value;

    if (newState === '') {
      return;
    }

    if (states.some(x => x === newState)) {
      window.alert('Este estado já foi adicionado');
      return;
    }

    onAddState(newState);
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
                <i className={`${fontAwesome.fa} ${fontAwesome.faTrash}`} />
              </Button>
            </li>
          ))}
        </ul>

        <div className={styles.addState}>
          <input
            type="text"
            onKeyDown={this.handleInputKeyDown}
            ref={(ref) => { this.input = ref; }}
          />
          <Button
            onClick={this.handleAddClick}
            title="Adicionar Estado"
          >
            <i className={`${fontAwesome.fa} ${fontAwesome.faPlus}`} />
          </Button>
        </div>
      </div>
    );
  }
}

EditStatesList.propTypes = {
  states: statesPropTypes.isRequired,
  onAddState: PropTypes.func.isRequired,
  onDeleteState: PropTypes.func.isRequired,
};

export default EditStatesList;
