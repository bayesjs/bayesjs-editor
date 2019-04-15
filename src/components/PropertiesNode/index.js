import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeNodeDescription, changeNodeId } from '../../actions';

import Button from '../Button';
import { getComponentTestId } from '../../utils/test-utils';
import { getNodes } from '../../selectors';
import { nodePropTypes } from '../../models';
import styles from './styles.css';

class PropertiesNode extends Component {
  constructor(props) {
    super(props);
    const { node } = props;

    this.state = {
      inputText: node.id,
      nodeDescription: node.description || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { id, description } = nextProps.node;

    this.setState({
      inputText: id,
      nodeDescription: description || '',
    });
  }

  handleOnChange = (e) => {
    const { value, id } = e.target;

    if (id === 'description') {
      this.setState({ nodeDescription: value });
    } else if (id === 'name') {
      this.setState({ inputText: value });
    }
  };

  handleNodeNameBlur = (e) => {
    const { node, nodes, dispatch } = this.props;
    const { inputText } = this.state;
    const input = e.target;
    const { id } = node;
    const nextId = inputText;

    const alreadyExits = nodes
      .filter(x => x.id !== id)
      .some(x => x.id === nextId);

    if (nextId === '' || alreadyExits) {
      input.value = id;
    } else {
      dispatch(changeNodeId(id, nextId));
    }
  };

  handleNodeDescripionBlur = (e) => {
    const { node, dispatch } = this.props;
    const { value } = e.target;
    const { id } = node;

    dispatch(changeNodeDescription(id, value));
  };

  handleKeyUpDescription = (e) => {
    const key = e.keyCode || e.which;

    if (key === 13) {
      this.handleNodeDescripionBlur(e);
    }
  };

  render() {
    const { node, onEditNodeCpt, onEditNodeStates } = this.props;
    const { inputText, nodeDescription } = this.state;

    return (
      <div data-testid={getComponentTestId('PropertiesNode')}>
        <h2>Propriedades da Variável</h2>

        <div className={styles.fieldWrapper}>
          <label htmlFor="name">
          Nome
            <input
              id="name"
              type="text"
              value={inputText}
              onChange={this.handleOnChange}
              onBlur={this.handleNodeNameBlur}
            />
          </label>
        </div>

        <div className={styles.fieldWrapper}>
          <label htmlFor="description">
          Descrição
            <textarea
              id="description"
              value={nodeDescription}
              onChange={this.handleOnChange}
              onBlur={this.handleNodeDescripionBlur}
            />
          </label>
        </div>

        <div className={styles.fieldWrapper}>
          <Button onClick={() => onEditNodeStates(node)} name="editStates">
            Editar estados
          </Button>
        </div>

        <div className={styles.fieldWrapper}>
          <Button onClick={() => onEditNodeCpt(node)} name="editProbabilities">
            Editar probabilidades
          </Button>
        </div>
      </div>
    );
  }
}

PropertiesNode.propTypes = {
  node: nodePropTypes.isRequired,
  onEditNodeStates: PropTypes.func.isRequired,
  onEditNodeCpt: PropTypes.func.isRequired,
  nodes: PropTypes.arrayOf(nodePropTypes).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  nodes: getNodes(state),
});


export default connect(mapStateToProps)(PropertiesNode);
