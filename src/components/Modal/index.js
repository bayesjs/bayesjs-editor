import React, { PropTypes } from 'react';
import ReactModal from 'react-modal';

const style = {
  overlay: {
    backgroundColor: 'rgba(50, 50, 50, 0.75)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    border: 'solid 1px #ccc',
    borderRadius: 0,
  },
};

const Modal = ({
  isOpen,
  onRequestClose,
  children,
}) => (
  <ReactModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={style}
  >
    {children}
  </ReactModal>
);

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
};

export default Modal;
