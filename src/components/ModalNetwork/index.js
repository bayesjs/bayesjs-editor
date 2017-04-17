import React, { PropTypes, Component } from "react";
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

class ModalNetwork extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true
    };
  }

  render() {
    const { visible } = this.state;

    return (
      <ReactModal
        isOpen={visible}
        onRequestClose={() => this.setState({ visible: !visible })}
        contentLabel={'Teste'}>
        
        {this.props.children}

      </ReactModal>
    );
  }
};

export default ModalNetwork;