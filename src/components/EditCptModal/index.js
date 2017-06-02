import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNodeCpt } from '../../actions';
import Modal from '../Modal';
import Button from '../Button';
import InputCpt from '../InputCpt';
import styles from './styles.css';
import float from 'float';

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

  handleCptKeyup = (e) => {
    const key = e.keyCode || e.which;
    const { node } = this.props;

    if (key === 13) {
      if (node.parents.length === 0) {
        this.handleSaveWithoutParents();
      } else {
        this.handleSaveWithParents();
      }
    }
  }

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
    const sum = float.round(states.reduce((acc, x) => acc + cpt[x], 0), 2);
    
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
      const sum = float.round(states.reduce((acc, x) => acc + cpt[i].then[x], 0), 2);
      
      if (sum !== 1) {
        alert('A soma das probabilidades para cada uma das linhas deve ser igual a 1');
        return;
      }
    }

    this.props.dispatch(changeNodeCpt(this.props.node.id, cpt));
    this.props.onRequestClose();
  };

  getValidValue = (value) => {
    const valueFloat = parseFloat(value || '0');

    if (valueFloat > 1) {
      return 1;
    } else if (valueFloat < 0) {
      return 0;
    }

    return valueFloat;
  };

  getRestFromValue = (valueFloat) => {
    const isInt = Number.isInteger(valueFloat);
    const precicion = isInt ? 0 : `${valueFloat}`.split('.')[1].length;
    
    return float.round((1 - valueFloat), precicion)
  };

  onChangeWithParents = (currentState, value, valueFloat, twoStates, states, cptIndex) => {
    const cpts = this.state.cpt;
    const cpt = cpts[cptIndex];
    const then = cpt.then;
    then[currentState] = valueFloat;
    
    if (twoStates) {
      const state = states.find(state => state !== currentState);

      then[state] = this.getRestFromValue(valueFloat);
    }

    this.setState({
      cpt: cpts
    });
  };

  onChangeWithoutParents = (currentState, value, valueFloat, twoStates, states) => {
    const newCpt = { 
      ...this.state.cpt,
      [currentState]: valueFloat
    };
    
    if (twoStates) {
      const state = states.find(state => state !== currentState);

      newCpt[state] = this.getRestFromValue(valueFloat);
    }

    this.setState({
      cpt: newCpt
    });
  };

  onChange = (states, cptIndex) => {
    const twoStates = states.length === 2;
    const isArray = cptIndex !== undefined;
    const func = isArray ? this.onChangeWithParents : this.onChangeWithoutParents;

    return (e) => {
      const { id, value } = e.target;
      const valueFloat = this.getValidValue(value);

      func(id, value, valueFloat, twoStates, states, cptIndex);
    };
  };

  renderCptWithoutParents() {
    const { cpt } = this.state;
    const states = Object.keys(cpt);

    return (
      <table className={styles.cpt}>
        {this.renderHeader()}
        {this.renderBody()}
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
        {this.renderHeader()}
        {this.renderBody()}
      </table>
    );
  }

  renderHeader = () => {
    const { node } = this.props;
    const { parents, states } = node;
    const hasParents = parents.length > 0;
    const firstStateCellStyle = {
      borderLeft: `solid ${hasParents ? 3 : 1}px black`,
    };

    return (
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
    );
  };

  sumCptThen = (cpt) => {
    const keys = Object.keys(cpt);
    const sum = keys
      .map((key) => cpt[key])
      .reduce((acc, v) => acc + v)

    return float.round(sum, 2);
  }

  renderBody = () => {
    const { node } = this.props;
    const { parents, states } = node;
    const { cpt } = this.state;
    const hasParents = parents.length > 0;
    const firstStateCellStyle = {
      borderLeft: `solid ${hasParents ? 3 : 1}px black`,
    };
    
    if (!hasParents) {
      return (
        <tbody>
          <tr>
            {states.map(state => (
              <td key={state}>
                <InputCpt
                  id={state}
                  value={cpt[state]}
                  onChange={this.onChange(states)}
                  onBlur={e => this.handleCptWithoutParentsBlur(e, state)}
                  onKeyUp={this.handleCptKeyup}
                />
              </td>
            ))}
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {cpt.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {parents.map(parent => (
              <td key={parent}>{row.when[parent]}</td>
            ))}
            {states.map((state, stateIndex) => (
              <td key={state} style={stateIndex === 0 ? firstStateCellStyle : null}>
                 <InputCpt
                    id={state}
                    value={row.then[state]}
                    onChange={this.onChange(states, rowIndex)}
                    onBlur={e => this.handleCptWithParentsBlur(e, state)}
                    onKeyUp={this.handleCptKeyup}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
    {/*<td key={`${rowIndex}-result`}>
      {this.sumCptThen(row.then)}
    </td>*/}
  };

  numberOfProbabilities = (hasParents) => {
    if (!hasParents) return 1;
  }

  render() {
    const { node, onRequestClose } = this.props;
    let nProb = 0;
    let nodeId = '';
    let children = null;

    if (node != null) {
      const hasParents = node.parents.length > 0;
      nProb = this.numberOfProbabilities(hasParents);
      
      nodeId = node.id;
      children = (
        <div className={styles.container}>
          <div className={styles.cptContainer}>
            {!hasParents ? (
              this.renderCptWithoutParents()
            ) : (
              this.renderCptWithParents()
            )}
          </div>

          <div className={styles.buttons}>
            <Button
              primary
              onClick={!hasParents ? (
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
    } else {
      nProb = 0;
    }

    return (
      <Modal
        title={`Editar Tabela de Probabilidades (${nodeId})`}
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
