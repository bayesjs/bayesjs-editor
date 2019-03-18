import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import classNames from 'classnames';
import fontAwesome from 'font-awesome/css/font-awesome.css';
import styles from './styles.css';

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
    border: 'solid 1px #333',
    borderRadius: 0,
    padding: 0,
    margin: 0,
  },
};

const Modal = ({
  title,
  isOpen,
  onRequestClose,
  children,
}) => (
  <ReactModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={style}
    contentLabel={title}
  >
    <div className={styles.header}>
      {title}
      <i
        onClick={onRequestClose}
        className={classNames([fontAwesome.fa, fontAwesome.faTimes, styles.closeButton])}
        title="Fechar"
      />
    </div>

    <div className={styles.body}>
      {children}
    </div>
  </ReactModal>
);

Modal.defaultProps = {
  children: null,
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  children: PropTypes.element,
};

export default Modal;
