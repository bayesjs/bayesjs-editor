import React, { PropTypes } from 'react';
import Modal from '../Modal';

const EditStates = ({
  node,
  onRequestClose,
}) => {
  let children = null;

  if (node != null) {
    children = <h1>{node.id}!</h1>;
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
};

EditStates.propTypes = {
  node: PropTypes.object,
  onRequestClose: PropTypes.func.isRequired,
};

export default EditStates;
