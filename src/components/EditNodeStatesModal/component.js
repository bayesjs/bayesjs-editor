import React, { useCallback, useState } from 'react';
import {
  append,
  complement,
  includes,
  isEmpty,
  prop,
  remove,
  thunkify,
} from 'ramda';

import Button from '@components/Button';
import Modal from '@components/Modal';
import NodeAddState from '@components/NodeAddState';
import NodeStatesEditList from '@components/NodeStatesEditList';
import PropTypes from 'prop-types';
import { bem } from '@utils/styles';
import { nodePropTypes } from '@models';
import styles from './styles.scss';

const componentClassName = bem(styles);

const propStates = prop('states');
const propId = prop('id');
const notIncludes = complement(includes);
const isNotEmpty = complement(isEmpty);

const onAddStateHandler = (states, setStates, onAlert) => (state) => {
  const isValid = notIncludes(state, states);

  if (isValid) {
    setStates(append(state, states));
  } else {
    onAlert(`O estado "${state}" já foi adicionado.`);
  }

  return isValid;
};

const onSaveHandler = thunkify(({ id }, states, onSave, onAlert) => {
  const isValid = isNotEmpty(states);

  if (isValid) {
    onSave(id, states);
  } else {
    onAlert('Você deve informar pelo menos um estado.');
  }
});

const EditNodeStatesModal = ({
  node,
  onSave,
  onCancel,
  onAlert,
}) => {
  const [states, setStates] = useState(propStates(node));
  const onDeleteState = useCallback(({ index }) => setStates(remove(index, 1, states)), [states]);
  const onAddState = useCallback(
    onAddStateHandler(states, setStates, onAlert),
    [states, setStates, onAlert],
  );
  const onHandleSave = useCallback(
    onSaveHandler(node, states, onSave, onAlert),
    [node, states, onSave, onAlert],
  );

  return (
    <Modal
      title={`Editar Estados (${propId(node)})`}
      onRequestClose={onCancel}
      isOpen
    >
      <div className={componentClassName}>
        <NodeStatesEditList states={states} onDeleteState={onDeleteState} />
        <NodeAddState onAddState={onAddState} />

        <div>
          <Button
            className={componentClassName.element('save-button').toString()}
            onClick={onHandleSave}
            name="save"
            primary
          >
            Salvar
          </Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  );
};

EditNodeStatesModal.propTypes = {
  node: nodePropTypes,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAlert: PropTypes.func.isRequired,
};

EditNodeStatesModal.defaultProps = {
  node: null,
};

export default EditNodeStatesModal;
