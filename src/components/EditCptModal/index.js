import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNodeCpt } from '../../actions';
import Modal from '../Modal';
import Button from '../Button';
import styles from './styles.css';

class EditCptModal extends Component {
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

  handleCptWithParentsBlur = (e, state, index) => {
    const input = e.target;
    const value = parseFloat(input.value.replace(',', '.'));

    if (isNaN(value)) {
      input.value = this.state.cpt[index].then[state];
    } else {
      const nextCpt = this.state.cpt.map((row, rowIndex) => {
        if (rowIndex !== index) {
          return row;
        }

        return {
          ...row,
          then: {
            ...row.then,
            [state]: value,
          },
        };
      });

      this.setState({ cpt: nextCpt });
    }
  };

  handleSaveWithoutParents = () => {
    const { cpt } = this.state;
    const states = Object.keys(cpt);

    const sum = states.reduce((acc, x) => acc + cpt[x], 0);

    if (sum !== 1) {
      alert('A soma das probabilidades deve ser igual a 1');
      return;
    }

    this.props.dispatch(changeNodeCpt(this.props.node.id, cpt));
    this.props.onRequestClose();
  };

  handleSaveWithParents = () => {
    const { cpt } = this.state;

    for (let i = 0; i < cpt.length; i++) {
      const states = Object.keys(cpt[i].then);
      const sum = states.reduce((acc, x) => acc + cpt[i].then[x], 0);

      if (sum !== 1) {
        alert('A soma das probabilidades para cada uma das linhas deve ser igual a 1');
        return;
      }
    }

    this.props.dispatch(changeNodeCpt(this.props.node.id, cpt));
    this.props.onRequestClose();
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
    const { cpt } = this.state;
    const parents = Object.keys(cpt[0].when);
    const states = Object.keys(cpt[0].then);

    const firstStateCellStyle = {
      borderLeft: 'solid 3px black',
    };

    return (
      <table className={styles.cpt}>
        <thead>
          <tr>
            {parents.map(parent => (
              <th key={parent}>{parent}</th>
            ))}
            {states.map((state, stateIndex) => (
              <th key={state} style={stateIndex === 0 ? firstStateCellStyle : null}>
                {state}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cpt.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {parents.map(parent => (
                <td key={parent}>{row.when[parent]}</td>
              ))}
              {states.map((state, stateIndex) => (
                <td key={state} style={stateIndex === 0 ? firstStateCellStyle : null}>
                  <input
                    defaultValue={row.then[state]}
                    onBlur={e => this.handleCptWithParentsBlur(e, state, rowIndex)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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

EditCptModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  node: PropTypes.object,
  onRequestClose: PropTypes.func.isRequired,
};

export default connect()(EditCptModal);
