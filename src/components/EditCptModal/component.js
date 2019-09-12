import React, { useState, useCallback } from 'react';

import Button from 'components/Button';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import { nodePropTypes } from 'models';
import { isEnterKey } from 'utils/event';
import { isNodeCptValid } from 'validations/node';
import CptParentStatesTable from 'components/CptParentStatesTable';
import CptEditTable from 'components/CptEditTable';
import styles from './styles.scss';

const handleCptKeyUpCreator = handleSave => (e) => {
  if (isEnterKey(e)) {
    handleSave();
  }
};

const handleSaveCreator = (cpt, onChangeNodeCpt, onRequestClose) => {
  if (isNodeCptValid(cpt)) {
    onChangeNodeCpt(cpt);
    onRequestClose();
  } else {
    window.alert('A soma das probabilidades para cada uma das linhas deve ser igual a 1');
  }
};

const EditCptModal = ({
  node,
  hasParents,
  onRequestClose,
  onChangeNodeCpt,
}) => {
  const { id, states } = node;
  const [cpt, setCpt] = useState(node.cpt);
  const handleSave = useCallback(
    () => handleSaveCreator(cpt, onChangeNodeCpt, onRequestClose),
    [cpt],
  );
  const handleCptKeyUp = handleCptKeyUpCreator(handleSave);

  return (
    <Modal
      title={`Editar Tabela de Probabilidades (${id})`}
      onRequestClose={onRequestClose}
      isOpen
    >
      <div>
        <div className={styles.tablesContainer}>
          {hasParents && <CptParentStatesTable node={node} />}
          <CptEditTable
            cpt={cpt}
            hasParents={hasParents}
            states={states}
            onChange={setCpt}
            onKeyUp={handleCptKeyUp}
          />
        </div>

        <div className={styles.buttonsContainer}>
          <Button onClick={handleSave} primary>
            Salvar
          </Button>

          <Button onClick={onRequestClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

EditCptModal.propTypes = {
  node: nodePropTypes,
  onChangeNodeCpt: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  hasParents: PropTypes.bool.isRequired,
};

EditCptModal.defaultProps = {
  node: null,
};

export default EditCptModal;
