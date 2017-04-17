import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { changeNodeId } from '../../actions';
import { getNodes } from '../../selectors';
import Button from '../Button';
import styles from './styles.css';

class PropertiesNode extends Component {
  constructor(props) {
    super(props);
    const { node } = props;
    
    this.state = {
      inputText: node.id
    };
  }

  componentWillReceiveProps(nextProps) {
    const inputText = nextProps.node.id;

    this.setState({ inputText })
  }

  handleOnChange = (e) => {
    const inputText = e.target.value;
    this.setState({ inputText });
  };

  handleNodeNameBlur = (e) => {
    const { node, nodes, dispatch } = this.props;
    const input = e.target;
    const id = node.id;
    const nextId = this.state.inputText;

    const alreadyExits = nodes
      .filter(x => x.id !== id)
      .some(x => x.id === nextId);

    if (nextId === '' || alreadyExits) {
      input.value = id;
    } else {
      dispatch(changeNodeId(id, nextId));
    }
  };

  render() {
    const { node } = this.props;

    return (
      <div>
        <h2>Propriedades da Variável</h2>

        <div className={styles.fieldWrapper}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={this.state.inputText}
            onChange={this.handleOnChange}
            onBlur={this.handleNodeNameBlur}
          />
        </div>

        <div className={styles.fieldWrapper}>
          <Button onClick={() => this.props.onEditNodeStates(node)}>
            Editar estados
          </Button>
        </div>

        <div className={styles.fieldWrapper}>
          <Button onClick={() => this.props.onEditNodeCpt(node)}>
            Editar probabilidades
          </Button>
        </div>
      </div>
    );
  }
}

PropertiesNode.propTypes = {
  node: PropTypes.object.isRequired,
  onEditNodeStates: PropTypes.func.isRequired,
  onEditNodeCpt: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  nodes: getNodes(state),
});


export default connect(mapStateToProps)(PropertiesNode);