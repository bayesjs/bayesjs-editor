import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNodeCpt } from '../../actions';
import Modal from '../Modal';
import Button from '../Button';
import styles from './styles.css';

class EditCpt extends Component {
  state = {
    cpt: null,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.node == null && nextProps.node != null) {
      const { parents, cpt } = nextProps.node;
      let cptClone;

      if (parents.length === 0) {
        cptClone = { ...cpt };
      } else {
        cptClone = cpt.map(x => ({
          when: { ...x.when },
          then: { ...x.then },
        }));
      }

      this.setState({ cpt: cptClone });
    }
  }

  handleCptWithoutParentsBlur = (e, state) => {
    const input = e.target;
    const value = parseFloat(input.value.replace(',', '.'));

    if (isNaN(value)) {
      input.value = this.state.cpt[state].toFixed(2);
    } else {
      this.setState({
        cpt: {
          ...this.state.cpt,
          [state]: value,
        },
      });
    }
  };

  handleSaveWithoutParents = () => {
    const { cpt } = this.state;
    const states = Object.keys(cpt);

    const sum = states.reduce((acc, x) => acc + cpt[x], 0);

    if (sum !== 1) {
      alert('A soma das probabilidades deve ser igual a 1.');
      return;
    }

    this.props.dispatch(changeNodeCpt(this.props.node.id, cpt));
    this.props.onRequestClose();
  };

  handleSaveWithParents = () => {
    console.log('salvar');
  };

  renderCptWithoutParents() {
    const { cpt } = this.state;
    const states = Object.keys(cpt);

    return (
      <table className={styles.cpt}>
        <thead>
          <tr>
            {states.map(state => (
              <th key={state}>{state}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {states.map(state => (
              <td key={state}>
                <input
                  defaultValue={cpt[state]}
                  onBlur={e => this.handleCptWithoutParentsBlur(e, state)}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  }

  renderCptWithParents() {
    return (
      <h1>CPT</h1>
    );
  }

  render() {
    const { node, onRequestClose } = this.props;

    let children = null;

    if (node != null) {
      children = (
        <div className={styles.container}>
          {node.parents.length === 0 ? (
            this.renderCptWithoutParents()
          ) : (
            this.renderCptWithParents()
          )}

          <div className={styles.buttons}>
            <Button
              primary
              onClick={node.parents.length === 0 ? (
                this.handleSaveWithoutParents
              ) : (
                this.handleSaveWithParents
              )}
            >
              Salvar
            </Button>

            <Button
              onClick={onRequestClose}
            >
              Cancelar
            </Button>
          </div>
        </div>
      );
    }

    return (
      <Modal
        title="Editar Tabela de Probabilidades"
        isOpen={node != null}
        onRequestClose={onRequestClose}
      >
        {children}
      </Modal>
    );
  }
}

EditCpt.propTypes = {
  dispatch: PropTypes.func.isRequired,
  node: PropTypes.object,
  onRequestClose: PropTypes.func.isRequired,
};

export default connect()(EditCpt);
