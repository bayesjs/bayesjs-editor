import React, { Fragment, useState, useCallback } from 'react';

import Button from 'components/Button';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import { nodePropTypes } from 'models';
import { isEnterKey } from 'utils/event';
import { isNodeCptValid } from 'validations/node';
import NodeCptParentStatesTable from 'components/NodeCptParentStatesTable';
import NodeCptEditTable from 'components/NodeCptEditTable';
import styles from './styles.scss';

const handleCptKeyUpCreator = handleSave => (e) => {
  if (isEnterKey(e)) {
    handleSave();
  }
};

const handleSaveCreator = (cpt, onSave, onAlert) => {
  if (isNodeCptValid(cpt)) {
    onSave(cpt);
  } else {
    onAlert('A soma das probabilidades para cada uma das linhas deve ser igual a 1');
  }
};

const EditNodeCptModal = ({
  node,
  hasParents,
  onSave,
  onCancel,
  onAlert,
}) => {
  const { id, states } = node;
  const [cpt, setCpt] = useState(node.cpt);
  const handleSave = useCallback(
    () => handleSaveCreator(cpt, onSave, onAlert),
    [cpt],
  );
  const handleCptKeyUp = handleCptKeyUpCreator(handleSave);

  return (
    <Modal
      title={`Editar Tabela de Probabilidades (${id})`}
      onRequestClose={onCancel}
      isOpen
    >
      <Fragment>
        <div className={styles.tablesContainer}>
          {hasParents && <NodeCptParentStatesTable node={node} />}
          <NodeCptEditTable
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

          <Button onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </Fragment>
    </Modal>
  );
};

EditNodeCptModal.propTypes = {
  node: nodePropTypes,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAlert: PropTypes.func.isRequired,
  hasParents: PropTypes.bool.isRequired,
};

EditNodeCptModal.defaultProps = {
  node: null,
};

export default EditNodeCptModal;
