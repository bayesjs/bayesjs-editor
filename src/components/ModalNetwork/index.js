import React, { Component } from 'react';

import ReactModal from 'react-modal';
import PropTypes from 'prop-types';

class ModalNetwork extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };
  }

  render() {
    const { children } = this.props;
    const { visible } = this.state;

    return (
      <ReactModal
        isOpen={visible}
        onRequestClose={() => this.setState({ visible: !visible })}
        contentLabel="Teste"
      >

        {children}

      </ReactModal>
    );
  }
}

ModalNetwork.defaultProps = {
  children: null,
};

ModalNetwork.propTypes = {
  children: PropTypes.element,
};

export default ModalNetwork;
